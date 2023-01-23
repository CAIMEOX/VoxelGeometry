import { Vec3 } from "./vector.js";

const PATH_COMMAND = {
  MOVE: "m",
  LINE: "l",
  QUADRATIC_CURVE: "q",
  BEZIER_CURVE: "b",
};

class Transform {
  context: Context;
  matrix: Array<number>;
  stack: any[];
  m: number[] = [];

  constructor(context: Context) {
    this.context = context;
    this.matrix = [1, 0, 0, 1, 0, 0];
    this.stack = [];
  }

  setContext(context: any) {
    this.context = context;
  }

  getMatrix() {
    return this.matrix;
  }

  setMatrix(m: number[]) {
    this.matrix = [m[0], m[1], m[2], m[3], m[4], m[5]];
    this.setTransform();
  }

  cloneMatrix(m: any[]) {
    return [m[0], m[1], m[2], m[3], m[4], m[5]];
  }

  //==========================================
  // Stack
  //==========================================

  save() {
    const matrix = this.cloneMatrix(this.getMatrix());
    this.stack.push(matrix);

    if (this.context) this.context.save();
  }

  restore() {
    if (this.stack.length > 0) {
      const matrix = this.stack.pop();
      this.setMatrix(matrix);
    }

    if (this.context) this.context.restore();
  }

  //==========================================
  // Matrix
  //==========================================

  setTransform() {
    // if (this.context) {
    //   this.context.setTransform(
    //     this.matrix[0],
    //     this.matrix[1],
    //     this.matrix[2],
    //     this.matrix[3],
    //     this.matrix[4],
    //     this.matrix[5]
    //   );
    // }
  }

  translate(x: number, y: number) {
    this.matrix[4] += this.matrix[0] * x + this.matrix[2] * y;
    this.matrix[5] += this.matrix[1] * x + this.matrix[3] * y;

    this.setTransform();
  }

  rotate(rad: number) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const m11 = this.matrix[0] * c + this.matrix[2] * s;
    const m12 = this.matrix[1] * c + this.matrix[3] * s;
    const m21 = this.matrix[0] * -s + this.matrix[2] * c;
    const m22 = this.matrix[1] * -s + this.matrix[3] * c;
    this.matrix[0] = m11;
    this.matrix[1] = m12;
    this.matrix[2] = m21;
    this.matrix[3] = m22;
    this.setTransform();
  }

  scale(sx: number, sy: number) {
    this.matrix[0] *= sx;
    this.matrix[1] *= sx;
    this.matrix[2] *= sy;
    this.matrix[3] *= sy;

    this.setTransform();
  }

  //==========================================
  // Matrix extensions
  //==========================================

  rotateDegrees(deg: number) {
    const rad = (deg * Math.PI) / 180;
    this.rotate(rad);
  }

  rotateAbout(rad: number, x: number, y: number) {
    this.translate(x, y);
    this.rotate(rad);
    this.translate(-x, -y);
    this.setTransform();
  }

  rotateDegreesAbout(deg: any, x: number, y: number) {
    this.translate(x, y);
    this.rotateDegrees(deg);
    this.translate(-x, -y);
    this.setTransform();
  }

  identity() {
    this.m = [1, 0, 0, 1, 0, 0];
    this.setTransform();
  }

  multiply(matrix: { m: number[] }) {
    const m11 = this.matrix[0] * matrix.m[0] + this.matrix[2] * matrix.m[1];
    const m12 = this.matrix[1] * matrix.m[0] + this.matrix[3] * matrix.m[1];

    const m21 = this.matrix[0] * matrix.m[2] + this.matrix[2] * matrix.m[3];
    const m22 = this.matrix[1] * matrix.m[2] + this.matrix[3] * matrix.m[3];

    const dx =
      this.matrix[0] * matrix.m[4] +
      this.matrix[2] * matrix.m[5] +
      this.matrix[4];
    const dy =
      this.matrix[1] * matrix.m[4] +
      this.matrix[3] * matrix.m[5] +
      this.matrix[5];

    this.matrix[0] = m11;
    this.matrix[1] = m12;
    this.matrix[2] = m21;
    this.matrix[3] = m22;
    this.matrix[4] = dx;
    this.matrix[5] = dy;
    this.setTransform();
  }

  invert() {
    const d =
      1 / (this.matrix[0] * this.matrix[3] - this.matrix[1] * this.matrix[2]);
    const m0 = this.matrix[3] * d;
    const m1 = -this.matrix[1] * d;
    const m2 = -this.matrix[2] * d;
    const m3 = this.matrix[0] * d;
    const m4 =
      d * (this.matrix[2] * this.matrix[5] - this.matrix[3] * this.matrix[4]);
    const m5 =
      d * (this.matrix[1] * this.matrix[4] - this.matrix[0] * this.matrix[5]);
    this.matrix[0] = m0;
    this.matrix[1] = m1;
    this.matrix[2] = m2;
    this.matrix[3] = m3;
    this.matrix[4] = m4;
    this.matrix[5] = m5;
    this.setTransform();
  }

  //==========================================
  // Helpers
  //==========================================

  transformPoint(pt: { x: any; y: any }): Point {
    const x = pt.x;
    const y = pt.y;
    return {
      x: x * this.matrix[0] + y * this.matrix[2] + this.matrix[4],
      y: x * this.matrix[1] + y * this.matrix[3] + this.matrix[5],
    };
  }
}
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
class Bitmap {
  width: number;
  height: number;
  data: Vec3[];

  constructor(w: number, h: number) {
    this.width = Math.floor(w);
    this.height = Math.floor(h);
    this.data = [];
  }

  dot(x: number, y: number) {
    this.data.push(new Vec3(x, 0, y));
  }

  getContext() {
    return new Context(this);
  }

  getBlocks() {
    return this.data;
  }
}
class Context {
  bitmap: any;
  _lineWidth: number;
  transform: Transform;
  _clip: Line[] | null = null;
  path: (string | Point | object)[];
  pathstart: any;

  constructor(bitmap: Bitmap) {
    this.path = [];
    this.bitmap = bitmap;
    this._lineWidth = 1;
    this.transform = new Transform(this);
  }

  save() {
    this.transform.save();
  }

  translate(x: any, y: any) {
    this.transform.translate(x, y);
  }

  rotate(angle: any) {
    this.transform.rotate(angle);
  }

  scale(sx: any, sy: any) {
    this.transform.scale(sx, sy);
  }

  restore() {
    this.transform.restore();
  }

  fillRect(x: number, y: number, w: number, h: number) {
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + h; j++) {
        this.bitmap.dot(i, j);
      }
    }
  }

  clearRect(x: number, y: number, w: number, h: number) {
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + h; j++) {
        this.bitmap.dot(i, j);
      }
    }
  }

  strokeRect(x: number, y: number, w: number, h: number) {
    for (let i = x; i < x + w; i++) {
      this.bitmap.dot(i, y);
      this.bitmap.dot(i, y + h);
    }
    for (let j = y; j < y + h; j++) {
      this.bitmap.dot(x, j);
      this.bitmap.dot(x + w, j);
    }
  }

  getImageData() {
    return this.bitmap;
  }

  beginPath() {
    this.path = [];
  }

  moveTo(x: any, y: any) {
    return this._moveTo(new Point(x, y));
  }

  _moveTo(pt: Point) {
    pt = this.transform.transformPoint(pt);
    this.pathstart = pt;
    this.path.push([PATH_COMMAND.MOVE, pt]);
  }

  lineTo(x: any, y: any) {
    return this._lineTo(new Point(x, y));
  }

  _lineTo(pt: Point) {
    this.path.push([PATH_COMMAND.LINE, this.transform.transformPoint(pt)]);
  }

  quadraticCurveTo(cp1x: any, cp1y: any, x: any, y: any) {
    const cp1 = this.transform.transformPoint(new Point(cp1x, cp1y));
    const pt = this.transform.transformPoint(new Point(x, y));
    this.path.push([PATH_COMMAND.QUADRATIC_CURVE, cp1, pt]);
  }

  bezierCurveTo(cp1x: any, cp1y: any, cp2x: any, cp2y: any, x: any, y: any) {
    this._bezierCurveTo(
      new Point(cp1x, cp1y),
      new Point(cp2x, cp2y),
      new Point(x, y)
    );
  }

  _bezierCurveTo(cp1: Point, cp2: Point, pt: Point) {
    cp1 = this.transform.transformPoint(cp1);
    cp2 = this.transform.transformPoint(cp2);
    pt = this.transform.transformPoint(pt);
    this.path.push([PATH_COMMAND.BEZIER_CURVE, cp1, cp2, pt]);
  }

  arc(
    x: number,
    y: number,
    rad: number,
    start: number,
    end: number,
    clockwise: any
  ) {
    function calcPoint(angle: number) {
      const px = x + Math.sin(angle) * rad;
      const py = y + Math.cos(angle) * rad;
      return new Point(px, py);
    }
    if (start > end) end += Math.PI * 2;

    const step = Math.PI / 16;
    if (clockwise) {
      const temp = end;
      end = start + Math.PI * 2;
      start = temp;
    }
    this._moveTo(calcPoint(start));
    for (let a = start; a <= end; a += step) {
      this._lineTo(calcPoint(a));
    }
    this._lineTo(calcPoint(end));
  }

  clip() {
    this._clip = pathToLines(this.path);
  }

  closePath() {
    this.path.push([PATH_COMMAND.LINE, this.pathstart]);
  }

  stroke() {
    pathToLines(this.path).forEach((line) => this.drawLine(line));
  }

  drawLine(line: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  }) {
    let x0 = Math.floor(line.start.x);
    let y0 = Math.floor(line.start.y);
    const x1 = Math.floor(line.end.x);
    const y1 = Math.floor(line.end.y);
    const dx = Math.abs(x1 - x0),
      sx = x0 < x1 ? 1 : -1;
    const dy = Math.abs(y1 - y0),
      sy = y0 < y1 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;
    for (;;) {
      this.bitmap.dot(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = err;
      if (e2 > -dx) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dy) {
        err += dx;
        y0 += sy;
      }
    }
  }

  fill() {
    const lines = pathToLines(this.path);
    const bounds = calcMinimumBounds(lines);
    for (let j = bounds.y2 - 1; j >= bounds.y; j--) {
      const ints = calcSortedIntersections(lines, j);
      for (let i = 0; i < ints.length; i += 2) {
        const start = Math.floor(ints[i]);
        const end = Math.floor(ints[i + 1]);
        for (let ii = start; ii <= end; ii++) {
          if (ii == start) {
            this.bitmap.dot(ii, j);
            continue;
          }
          if (ii == end) {
            this.bitmap.dot(ii, j);
            continue;
          }
          this.bitmap.dot(ii, j);
        }
      }
    }
  }

  pixelInsideClip(x: number, y: number) {
    if (!this._clip) return true;
    const ints = calcSortedIntersections(this._clip, y);
    const left = ints.filter((inter) => inter < x);
    if (left.length % 2 === 0) {
      return false;
    } else {
      return true;
    }
  }
}
class Line {
  start: Point;
  end: Point;
  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }
  getLength() {
    return Math.sqrt(
      Math.pow(this.start.x - this.end.x, 2) +
        Math.pow(this.start.y - this.end.y, 2)
    );
  }
}
function calcQuadraticAtT(p: Point[], t: number) {
  const x =
    (1 - t) * (1 - t) * p[0].x + 2 * (1 - t) * t * p[1].x + t * t * p[2].x;
  const y =
    (1 - t) * (1 - t) * p[0].y + 2 * (1 - t) * t * p[1].y + t * t * p[2].y;
  return new Point(x, y);
}

function calcBezierAtT(p: Point[], t: number) {
  const x =
    (1 - t) * (1 - t) * (1 - t) * p[0].x +
    3 * (1 - t) * (1 - t) * t * p[1].x +
    3 * (1 - t) * t * t * p[2].x +
    t * t * t * p[3].x;
  const y =
    (1 - t) * (1 - t) * (1 - t) * p[0].y +
    3 * (1 - t) * (1 - t) * t * p[1].y +
    3 * (1 - t) * t * t * p[2].y +
    t * t * t * p[3].y;
  return new Point(x, y);
}

function calcMinimumBounds(lines: any[]) {
  const bounds = {
    x: Number.MAX_VALUE,
    y: Number.MAX_VALUE,
    x2: Number.MIN_VALUE,
    y2: Number.MIN_VALUE,
  };
  function checkPoint(pt: { x: number; y: number }) {
    bounds.x = Math.min(bounds.x, pt.x);
    bounds.y = Math.min(bounds.y, pt.y);
    bounds.x2 = Math.max(bounds.x2, pt.x);
    bounds.y2 = Math.max(bounds.y2, pt.y);
  }
  lines.forEach(function (line: { start: any; end: any }) {
    checkPoint(line.start);
    checkPoint(line.end);
  });
  return bounds;
}

function calcSortedIntersections(lines: string | any[], y: number) {
  const xlist: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const A = lines[i].start;
    const B = lines[i].end;
    if ((A.y < y && B.y >= y) || (B.y < y && A.y >= y)) {
      const xval: number = A.x + ((y - A.y) / (B.y - A.y)) * (B.x - A.x);
      xlist.push(xval);
    }
  }
  return xlist.sort(function (a, b) {
    return a - b;
  });
}

function pathToLines(path: any[]) {
  const lines: Line[] = [];
  let curr: Point | null = null;
  path.forEach(function (cmd: any[]) {
    if (cmd[0] == PATH_COMMAND.MOVE) {
      curr = cmd[1];
    }
    if (cmd[0] == PATH_COMMAND.LINE) {
      const pt = cmd[1];
      lines.push(new Line(curr!, pt));
      curr = pt;
    }
    if (cmd[0] == PATH_COMMAND.QUADRATIC_CURVE) {
      const pts: Point[] = [curr, cmd[1], cmd[2]];
      for (let t = 0; t < 1; t += 0.1) {
        const pt: Point = calcQuadraticAtT(pts, t);
        lines.push(new Line(curr!, pt));
        curr = pt;
      }
    }
    if (cmd[0] == PATH_COMMAND.BEZIER_CURVE) {
      const pts: Point[] = [curr, cmd[1], cmd[2], cmd[3]];
      for (let t = 0; t < 1; t += 0.1) {
        const pt = calcBezierAtT(pts, t);
        lines.push(new Line(curr!, pt));
        curr = pt;
      }
    }
  });
  return lines;
}

export { Transform, Context, Bitmap, Point, Line };

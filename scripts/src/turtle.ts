import { BlockLocation } from "mojang-minecraft";

class Turtle2D {
  x: number;
  y: number;
  angle: number;
  thickness: number;
  pen: boolean = true;
  stack: { x: number; y: number; angle: number; pen: boolean; thickness: number }[];
  track: Array<BlockLocation>;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.thickness = 1;
    this.track = [];
    this.stack = [];
  }

  penUp() {
    this.pen = false;
  }

  penDown() {
    this.pen = true;
  }

  left() {
    this.angle += Math.PI / 2;
  }

  right() {
    this.angle -= Math.PI / 2;
  }

  rotate(angle: number) {
    this.angle += angle;
  }

  push() {
    this.stack.push({
      x: this.x,
      y: this.y,
      angle: this.angle,
      pen: this.pen,
      thickness: this.thickness,
    });
  }

  pop() {
    let state = this.stack.pop();
    if (state) {
      this.x = state.x;
      this.y = state.y;
      this.angle = state.angle;
      this.pen = state.pen;
      this.thickness = state.thickness;
    }
  }

  goto(x: number, y: number) {
    if (this.pen) {
      this.track.push(new BlockLocation(this.x, 0, this.y));
    }
    this.x = x;
    this.y = y;
  }

  width(width: number) {
    this.thickness = width;
  }

  dot(x: number, y: number) {
    if (this.pen) {
      if (this.thickness === 1) {
        this.track.push(new BlockLocation(x, 0, y));
      } else {
        let r = this.thickness / 2;
        for (let i = -r; i <= r; i++) {
          for (let j = -r; j <= r; j++) {
            for (let k = -r; k <= r; k++) {
              this.track.push(new BlockLocation(x + i, k, y + j));
            }
          }
        }
      }
    }
  }

  line(x1: number, y1: number) {
    let x0 = this.x;
    let y0 = this.y;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1;
    var sy = y0 < y1 ? 1 : -1;
    var err = dx - dy;

    while (true) {
      this.dot(x0, y0);

      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  forward(distance: number) {
    let x = this.x + Math.round(distance * Math.cos(this.angle));
    let y = this.y + Math.round(distance * Math.sin(this.angle));
    this.line(x, y);
    this.x = x;
    this.y = y;
  }

  backward(distance: number) {
    this.forward(-distance);
  }

  getTrack(): BlockLocation[] {
    return this.track;
  }
}

export { Turtle2D };

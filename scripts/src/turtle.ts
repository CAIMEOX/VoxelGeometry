import { BlockLocation } from "@minecraft/server";
import { construct, Matrix, operation } from "./lineamp";
import { put } from "./transform";
import { line } from "./generator";
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

const TO_DEGRESS = 180 / Math.PI;
const TO_RADIANS = Math.PI / 180;
const cos = Math.cos;
const sin = Math.sin;

class Turtle3D {
  pos: BlockLocation;
  // pitch: number;
  pen: Boolean;
  // H x L = U
  mat: Matrix;

  track: BlockLocation[];
  constructor(compass = 0, vertical = 0, roll = 0) {
    this.mat = this.makeMatrix(compass, vertical, roll);
    this.pen = true;
    this.track = [];

    this.pos = new BlockLocation(0, 0, 0);
    this.mat = operation.mul(this.RotateL(0.1), this.RotateH(0));
  }

  // Pen
  penUp() {
    this.pen = false;
  }

  penDown() {
    this.pen = true;
  }

  // rotation matrix
  // rollMatrix
  RotateU(a: number): Matrix {
    a = a * TO_RADIANS;
    return construct.fromArray([
      [cos(a), sin(a), 0],
      [-sin(a), cos(a), 0],
      [0, 0, 1],
    ]);
  }
  // yawMatrix
  RotateL(a: number): Matrix {
    a = a * TO_RADIANS;
    return construct.fromArray([
      [cos(a), 0, -sin(a)],
      [0, 1, 0],
      [sin(a), 0, cos(a)],
    ]);
  }
  // pitchMatrix
  RotateH(a: number): Matrix {
    a = a * TO_RADIANS;
    return construct.fromArray([
      [1, 0, 0],
      [0, cos(a), -sin(a)],
      [0, sin(a), cos(a)],
    ]);
  }

  goto(x: number, y: number, z: number) {
    this.pos = new BlockLocation(x, y, z);
  }

  makeMatrix(compass: number, vertical: number, roll: number) {
    let m = operation.mul(this.RotateL(compass), this.RotateH(vertical));
    return operation.mul(m, this.RotateU(roll));
  }

  getHeading(): BlockLocation {
    return this.mat.getVectorCol(2);
  }

  getAngles(): number[] {
    let heading: BlockLocation = this.getHeading();
    let xz = Math.sqrt(heading.x * heading.x + heading.z * heading.z);
    let rot = xz > 1e-9 ? Math.atan2(-heading.x, heading.z) : 0;
    let pitch = Math.atan2(-heading.x, xz);
    return [rot * TO_DEGRESS, pitch * TO_DEGRESS];
  }

  roll(a: number) {
    this.mat = operation.mul(this.mat, this.RotateU(a));
  }

  pitch(a: number) {
    this.mat = operation.mul(this.mat, this.RotateH(a));
  }

  yaw(a: number) {
    this.mat = operation.mul(this.mat, this.RotateL(a));
  }

  right(a: number) {
    this.mat = operation.mul(this.RotateL(a), this.mat);
  }

  left(a: number) {
    this.right(-a);
  }

  forward(d: number) {
    let heading = this.getHeading();
    let newPos = put([this.pos.x + heading.x * d, this.pos.y + heading.y * d, this.pos.z + heading.z * d]);
    this.track = this.track.concat(line(this.pos, newPos));
    this.pos = newPos;
  }

  backward(d: number) {
    this.forward(-d);
  }

  getTrack(): BlockLocation[] {
    return this.track;
  }
}

export { Turtle2D, Turtle3D };

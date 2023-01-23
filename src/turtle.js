import { Vec3 } from "./vector.js";
import { construct, operation } from "./lineamp.js";
import { put } from "./transform.js";
import { line } from "./generator.js";
class Turtle2D {
    constructor() {
        this.pen = true;
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
    rotate(angle) {
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
        const state = this.stack.pop();
        if (state) {
            this.x = state.x;
            this.y = state.y;
            this.angle = state.angle;
            this.pen = state.pen;
            this.thickness = state.thickness;
        }
    }
    goto(x, y) {
        if (this.pen) {
            this.track.push(new Vec3(this.x, 0, this.y));
        }
        this.x = x;
        this.y = y;
    }
    width(width) {
        this.thickness = width;
    }
    dot(x, y) {
        if (this.pen) {
            if (this.thickness === 1) {
                this.track.push(new Vec3(x, 0, y));
            }
            else {
                const r = this.thickness / 2;
                for (let i = -r; i <= r; i++) {
                    for (let j = -r; j <= r; j++) {
                        for (let k = -r; k <= r; k++) {
                            this.track.push(new Vec3(x + i, k, y + j));
                        }
                    }
                }
            }
        }
    }
    line(x1, y1) {
        let x0 = this.x;
        let y0 = this.y;
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        for (;;) {
            this.dot(x0, y0);
            if (x0 === x1 && y0 === y1)
                break;
            const e2 = 2 * err;
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
    forward(distance) {
        const x = this.x + Math.round(distance * Math.cos(this.angle));
        const y = this.y + Math.round(distance * Math.sin(this.angle));
        this.line(x, y);
        this.x = x;
        this.y = y;
    }
    backward(distance) {
        this.forward(-distance);
    }
    getTrack() {
        return this.track;
    }
}
const TO_DEGRESS = 180 / Math.PI;
const TO_RADIANS = Math.PI / 180;
const cos = Math.cos;
const sin = Math.sin;
class Turtle3D {
    constructor(compass = 0, vertical = 0, roll = 0) {
        this.stack = [];
        this.mat = this.makeMatrix(compass, vertical, roll);
        this.pen = true;
        this.track = [];
        this.pos = new Vec3(0, 0, 0);
        this.mat = operation.mul(this.RotateL(0.1), this.RotateH(0));
    }
    // Pen
    penUp() {
        this.pen = false;
    }
    penDown() {
        this.pen = true;
    }
    pop() {
        const state = this.stack.pop();
        this.pos = state.pos;
        this.mat = state.mat;
    }
    push() {
        this.stack.push({ pos: this.pos, mat: this.mat });
    }
    // rotation matrix
    // rollMatrix
    RotateU(a) {
        a = a * TO_RADIANS;
        return construct.fromArray([
            [cos(a), sin(a), 0],
            [-sin(a), cos(a), 0],
            [0, 0, 1],
        ]);
    }
    // yawMatrix
    RotateL(a) {
        a = a * TO_RADIANS;
        return construct.fromArray([
            [cos(a), 0, -sin(a)],
            [0, 1, 0],
            [sin(a), 0, cos(a)],
        ]);
    }
    // pitchMatrix
    RotateH(a) {
        a = a * TO_RADIANS;
        return construct.fromArray([
            [1, 0, 0],
            [0, cos(a), -sin(a)],
            [0, sin(a), cos(a)],
        ]);
    }
    goto(x, y, z) {
        this.pos = new Vec3(x, y, z);
    }
    makeMatrix(compass, vertical, roll) {
        const m = operation.mul(this.RotateL(compass), this.RotateH(vertical));
        return operation.mul(m, this.RotateU(roll));
    }
    getHeading() {
        return this.mat.getVectorCol(2);
    }
    getAngles() {
        const heading = this.getHeading();
        const xz = Math.sqrt(heading.x * heading.x + heading.z * heading.z);
        const rot = xz > 1e-9 ? Math.atan2(-heading.x, heading.z) : 0;
        const pitch = Math.atan2(-heading.x, xz);
        return [rot * TO_DEGRESS, pitch * TO_DEGRESS];
    }
    roll(a) {
        this.mat = operation.mul(this.mat, this.RotateU(a));
    }
    pitch(a) {
        this.mat = operation.mul(this.mat, this.RotateH(a));
    }
    yaw(a) {
        this.mat = operation.mul(this.mat, this.RotateL(a));
    }
    right(a) {
        this.mat = operation.mul(this.RotateL(a), this.mat);
    }
    left(a) {
        this.right(-a);
    }
    forward(d) {
        const heading = this.getHeading();
        const newPos = put([
            this.pos.x + heading.x * d,
            this.pos.y + heading.y * d,
            this.pos.z + heading.z * d,
        ]);
        this.track = this.track.concat(line(this.pos, newPos));
        this.pos = newPos;
    }
    backward(d) {
        this.forward(-d);
    }
    getTrack() {
        return this.track;
    }
}
export { Turtle2D, Turtle3D };

import { Vec3 } from './vector.js';
import { Matrix, fromArray } from './lineamp.js';
import { put } from './transform.js';
import { voxelLine } from './generator.js';
class Turtle2D {
	x: number;
	y: number;
	angle: number;
	thickness: number;
	pen = true;
	stack: {
		x: number;
		y: number;
		angle: number;
		pen: boolean;
		thickness: number;
	}[];
	track: Array<Vec3>;
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
			thickness: this.thickness
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

	goto(x: number, y: number) {
		if (this.pen) {
			this.track.push(new Vec3(this.x, 0, this.y));
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
				this.track.push(new Vec3(x, 0, y));
			} else {
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

	line(x1: number, y1: number) {
		let x0 = this.x;
		let y0 = this.y;
		const dx = Math.abs(x1 - x0);
		const dy = Math.abs(y1 - y0);
		const sx = x0 < x1 ? 1 : -1;
		const sy = y0 < y1 ? 1 : -1;
		let err = dx - dy;

		for (;;) {
			this.dot(x0, y0);

			if (x0 === x1 && y0 === y1) break;
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

	forward(distance: number) {
		const x = this.x + Math.round(distance * Math.cos(this.angle));
		const y = this.y + Math.round(distance * Math.sin(this.angle));
		this.line(x, y);
		this.x = x;
		this.y = y;
	}

	backward(distance: number) {
		this.forward(-distance);
	}

	getTrack(): Vec3[] {
		return this.track;
	}
}

const TO_DEGRESS = 180 / Math.PI;
const TO_RADIANS = Math.PI / 180;
const cos = Math.cos;
const sin = Math.sin;

class Turtle3D {
	pos: Vec3;
	// pitch: number;
	pen: boolean;
	// H x L = U
	mat: Matrix;
	stack: { pos: Vec3; mat: Matrix }[] = [];
	track: Vec3[];
	constructor(compass = 0, vertical = 0, roll = 0) {
		this.mat = this.makeMatrix(compass, vertical, roll);
		this.pen = true;
		this.track = [];
		this.pos = new Vec3(0, 0, 0);
		this.mat = this.RotateL(0.1).mul(this.RotateH(0));
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
	RotateU(a: number): Matrix {
		a = a * TO_RADIANS;
		return fromArray([
			[cos(a), sin(a), 0],
			[-sin(a), cos(a), 0],
			[0, 0, 1]
		]);
	}
	// yawMatrix
	RotateL(a: number): Matrix {
		a = a * TO_RADIANS;
		return fromArray([
			[cos(a), 0, -sin(a)],
			[0, 1, 0],
			[sin(a), 0, cos(a)]
		]);
	}
	// pitchMatrix
	RotateH(a: number): Matrix {
		a = a * TO_RADIANS;
		return fromArray([
			[1, 0, 0],
			[0, cos(a), -sin(a)],
			[0, sin(a), cos(a)]
		]);
	}

	goto(x: number, y: number, z: number) {
		this.pos = new Vec3(x, y, z);
	}

	makeMatrix(compass: number, vertical: number, roll: number) {
		return this.RotateL(compass).mul(this.RotateH(vertical)).mul(this.RotateU(roll));
	}

	getHeading(): Vec3 {
		return this.mat.getVectorCol(2);
	}

	getAngles(): number[] {
		const heading: Vec3 = this.getHeading();
		const xz = Math.sqrt(heading.x * heading.x + heading.z * heading.z);
		const rot = xz > 1e-9 ? Math.atan2(-heading.x, heading.z) : 0;
		const pitch = Math.atan2(-heading.x, xz);
		return [rot * TO_DEGRESS, pitch * TO_DEGRESS];
	}

	roll(a: number): void {
		this.mat = this.mat.mul(this.RotateU(a));
	}

	pitch(a: number): void {
		this.mat = this.mat.mul(this.RotateH(a));
	}

	yaw(a: number): void {
		this.mat = this.mat.mul(this.RotateL(a));
	}

	right(a: number): void {
		this.mat = this.RotateL(a).mul(this.mat);
	}

	left(a: number): void {
		this.right(-a);
	}

	forward(d: number): void {
		const heading = this.getHeading();
		const newPos = put([
			this.pos.x + heading.x * d,
			this.pos.y + heading.y * d,
			this.pos.z + heading.z * d
		]);
		this.track = this.track.concat(voxelLine(this.pos, newPos));
		this.pos = newPos;
	}

	backward(d: number): void {
		this.forward(-d);
	}

	getTrack(): Vec3[] {
		return this.track;
	}
}

export { Turtle2D, Turtle3D };

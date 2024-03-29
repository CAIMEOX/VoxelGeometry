import { Matrix, fromArray } from './lineamp.js';

class Vec3 {
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getMatrix(): Matrix {
		return fromArray([[this.x, this.y, this.z]]);
	}

	getMatrixCol(): Matrix {
		return fromArray([[this.x], [this.y], [this.z]]);
	}

	map(func: (x: number) => number): Vec3 {
		return new Vec3(func(this.x), func(this.y), func(this.z));
	}

	add(other: Vec3): Vec3 {
		return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	subtract(other: Vec3): Vec3 {
		return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	dot(other: Vec3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	cross(other: Vec3): Vec3 {
		return new Vec3(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);
	}

	scale(scalar: number): Vec3 {
		return this.map((v) => v * scalar);
	}

	equals(other: Vec3): boolean {
		return this.x === other.x && this.y === other.y && this.z === other.z;
	}

	normalize(): Vec3 {
		const mag = this.magnitude();

		if (mag === 0) {
			return new Vec3(0, 0, 0);
		}

		return this.map((v) => v / mag);
	}

	magnitude(): number {
		return Math.sqrt(this.dot(this));
	}

	angle(other: Vec3): number {
		const dotProduct = this.dot(other);
		const magProduct = this.magnitude() * other.magnitude();

		return Math.acos(dotProduct / magProduct);
	}

	projectOnto(other: Vec3): Vec3 {
		const scalar = this.dot(other) / other.magnitude() ** 2;

		return other.scale(scalar);
	}

	negate(): Vec3 {
		return this.map((v) => -v);
	}

	view(): [x: number, y: number, z: number] {
		return [this.x, this.y, this.z];
	}
}

function vec3(x: number, y: number, z: number): Vec3 {
	return new Vec3(x, y, z);
}

type Space = Vec3[];

export { Vec3, Space, vec3 };

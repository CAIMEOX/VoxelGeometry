import { Vec3 } from './vector.js';

class VectorN {
	values: number[];

	constructor(...values: number[]) {
		this.values = values;
	}

	get dimension(): number {
		return this.values.length;
	}

	map(fn: (n: number, i?: number) => number) {
		return new VectorN(...this.values.map(fn));
	}

	add(vector: VectorN): VectorN {
		return this.map((value, index) => value + vector.values[index]);
	}

	magnitude() {
		return Math.sqrt(this.values.reduce((sum, v) => (sum += v * v), 0));
	}

	asVector3() {
		return new Vec3(this.values[0], this.values[1], this.values[2]);
	}
}

type GeneralSpace = VectorN[];

function gen_patterns(d: string): number[] {
	return d.split('').map((value) => (value === '0' ? -1 : 1));
}

function symmetry_points(rank: number, point: VectorN): GeneralSpace {
	const res: GeneralSpace = [];
	for (let i = 0; i < 2 ** rank; i++) {
		let m = i.toString(2);
		m = '0'.repeat(rank - m.length) + m;
		const x = gen_patterns(m);
		const y = point.map((y, i) => y * x[i]);
		res.push(y);
	}
	return res;
}

function symmetry(rank: number, space: GeneralSpace): GeneralSpace {
	if (rank !== space[0].dimension) {
		throw new Error('Symmetry rank does not match Space dimension');
	} else {
		return space.map((p) => symmetry_points(rank, p)).flat();
	}
}

function test_ball(radius: number) {
	const result = [];
	for (let x = 0; x <= radius; x++) {
		for (let y = 0; y <= radius; y++) {
			for (let z = 0; z <= radius; z++) {
				if (x * x + y * y + z * z <= radius * radius) {
					result.push(new VectorN(x, y, z));
				}
			}
		}
	}
	return symmetry(3, result).map((p) => p.asVector3);
}

export { VectorN, symmetry };

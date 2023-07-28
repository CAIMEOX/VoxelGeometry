import { Vec3 } from './vector.js';

class VectorN {
	values: number[];

	constructor(...values: number[]) {
		this.values = values;
	}

	get dimension(): number {
		return this.values.length;
	}

	map(fn: (n: number, i?: number) => number): VectorN {
		return new VectorN(...this.values.map(fn));
	}

	add(vector: VectorN): VectorN {
		return this.map((value, index) => value + vector.values[index]);
	}

	magnitude(): number {
		return Math.sqrt(this.values.reduce((sum, v) => (sum += v * v), 0));
	}

	asVector3(): Vec3 {
		return new Vec3(this.values[0], this.values[1], this.values[2]);
	}
}

type GeneralSpace = VectorN[];

function symmetry_points(rank: number, point: VectorN): GeneralSpace {
	const res: GeneralSpace = [];
	for (let i = 0; i < 1 << rank; ++i)
		res.push(point.map((y, j) => ((i >> (rank - j - 1)) & 1 ? y : -y)));
	return res;
}

function symmetry(rank: number, space: GeneralSpace): GeneralSpace {
	if (rank !== space[0].dimension) {
		throw new Error('Symmetry rank does not match Space dimension');
	} else {
		return space.map((p) => symmetry_points(rank, p)).flat();
	}
}

export { VectorN, symmetry };

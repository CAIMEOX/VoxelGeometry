import { Vec3 } from './vector.js';
import { cons, oper } from './lineamp.js';

function embed(base: Vec3[], target: Vec3[]) {
	const xT: Map<number, Map<number, void>> = new Map();
	base.forEach((v) => {
		if (!xT.has(v.x)) xT.set(v.x, new Map());
		xT.get(v.x)?.set(v.z);
	});
	return target.filter((v) => xT.has(v.x) && xT.get(v.x)?.has(v.z));
}

// Swap The Direction of the Structure
function swap(v: Vec3[], d1: number, d2: number): Vec3[] {
	return v.map((b) => {
		const k = view(b);
		[k[d1], k[d2]] = [k[d2], k[d1]];
		return put(k);
	});
}

function view(v: Vec3) {
	return [v.x, v.y, v.z];
}

function put(k: number[]) {
	return new Vec3(k[0], k[1], k[2]);
}

function scale(v: Vec3[], size: number): Vec3[] {
	return v.flatMap((b) => move(duplicate(size), b.x * size - 1, b.y * size - 1, b.z * size - 1));
}

function diffusion(v: Vec3[], factor: number): Vec3[] {
	return v.map((b) => new Vec3(b.x * factor, b.y * factor, b.z * factor));
}

function P(x: number, y: number, z: number): Vec3 {
	return new Vec3(x, y, z);
}

// Create a Tile
function duplicate(n: number): Vec3[] {
	const r: Vec3[] = [];
	for (let x = -n; x < n; ++x) {
		for (let y = -n; y < n; ++y) {
			for (let z = -n; z < n; ++z) {
				r.push(new Vec3(x, y, z));
			}
		}
	}
	return r;
}

function center(b: Vec3[]): Vec3 {
	let [xmin, xmax, ymin, ymax, zmin, zmax] = [
		1000000000, -1000000000, 1000000000, -1000000000, 1000000000, -1000000000
	];
	b.forEach((v) => {
		xmin = Math.min(xmin, v.x);
		xmax = Math.max(xmax, v.x);
		ymin = Math.min(ymin, v.y);
		ymax = Math.max(ymax, v.y);
		zmin = Math.min(zmin, v.z);
		zmax = Math.max(zmax, v.z);
	});
	return new Vec3((xmin + xmax) / 2, (ymin + ymax) / 2, (zmin + zmax) / 2);
}

function move(b: Vec3[], x = 0, y = 0, z = 0): Vec3[] {
	return b.map((k) => new Vec3(x + k.x, y + k.y, z + k.z));
}

function moveTo(b: Vec3[], from: Vec3, to: Vec3): Vec3[] {
	return move(b, to.x - from.x, to.y - from.y, to.z - from.z);
}

function moveCenter(b: Vec3[]): Vec3[] {
	return moveTo(b, center(b), P(0, 0, 0));
}

// Array Generator
function array_gen(xn: number, yn: number, zn: number, dx = 1, dy = 1, dz = 1): Vec3[] {
	const r: Vec3[] = [];
	for (let x = 1; x < xn; ++x) {
		for (let y = 1; y < yn; ++y) {
			for (let z = 1; z < zn; ++z) {
				r.push(new Vec3(x * dx, y * dy, z * dz));
			}
		}
	}
	return r;
}

function array_gen_fn(
	xn: number,
	yn: number,
	zn: number,
	dx: (a: number) => number,
	dy: (a: number) => number,
	dz: (a: number) => number
): Vec3[] {
	const r: Vec3[] = [];
	for (let x = 1; x < xn; ++x) {
		for (let y = 1; y < yn; ++y) {
			for (let z = 1; z < zn; ++z) {
				r.push(new Vec3(dx(x), dy(y), dz(z)));
			}
		}
	}
	return r;
}

function rotate(v: Vec3[], angle: number) {
	const R_y = cons.fromArray([
		[Math.cos(angle), 0, Math.sin(angle)],
		[0, 1, 0],
		[-Math.sin(angle), 0, Math.cos(angle)]
	]);

	return v.map((b) => {
		const m = cons.fromArray([[b.x], [b.y], [b.z]]);
		const r = oper.mul(R_y, m).getVector(0);
		return r;
	});
}

// Take the last output as directional vector
function pipe(...mat: Vec3[][]): Vec3[] {
	let r: Vec3[] = mat.shift() ?? [];
	mat.forEach((next) => {
		let res: Vec3[] = [];
		r.forEach((k) => {
			res = res.concat(move(next, k.x, k.y, k.z));
		});
		r = res;
	});
	return r;
}

function reduce_pos(v: Vec3[]): Vec3[] {
	return embed(v, v);
}

function round_pos(v: Vec3[]): Vec3[] {
	return v.map(fmap(Math.round));
}

const fmap = (f: (arg: number) => number) => (v: Vec3) => {
	return new Vec3(f(v.x), f(v.y), f(v.z));
};

export {
	put,
	fmap,
	round_pos,
	scale,
	diffusion,
	rotate,
	swap,
	embed,
	move,
	center,
	moveCenter,
	moveTo,
	pipe,
	array_gen,
	array_gen_fn,
	reduce_pos
};

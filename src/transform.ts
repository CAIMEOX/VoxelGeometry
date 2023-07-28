import { Vec3, Space, put, view, vec3 } from './vector.js';
import { fromArray } from './lineamp.js';

function embed(base: Space, target: Space) {
	const xT: Map<number, Map<number, void>> = new Map();
	base.forEach((v) => {
		if (!xT.has(v.x)) xT.set(v.x, new Map());
		xT.get(v.x)?.set(v.z);
	});
	return target.filter((v) => xT.has(v.x) && xT.get(v.x)?.has(v.z));
}

// Swap The Direction of the Structure
function swap(v: Space, d1: number, d2: number): Space {
	return v.map((b) => {
		const k = view(b);
		[k[d1], k[d2]] = [k[d2], k[d1]];
		return put(k);
	});
}

function scale(v: Space, size: number): Space {
	return v.flatMap((b) => move(duplicate(size), b.scale(size).subtract(vec3(1, 1, 1))));
}

function diffusion(v: Space, factor: number): Space {
	return v.map((b) => b.map((x) => x * factor));
}

// Create a Tile
function duplicate(n: number): Space {
	const r: Space = [];
	for (let x = -n; x < n; ++x) {
		for (let y = -n; y < n; ++y) {
			for (let z = -n; z < n; ++z) {
				r.push(vec3(x, y, z));
			}
		}
	}
	return r;
}

function center(b: Space): Vec3 {
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
	return vec3((xmin + xmax) / 2, (ymin + ymax) / 2, (zmin + zmax) / 2);
}

function move(b: Space, point: Vec3): Space {
	return b.map(point.add);
}

function moveTo(b: Space, from: Vec3, to: Vec3): Space {
	return move(b, to.subtract(from));
}

// Array Generator
function array_gen(xn: number, yn: number, zn: number, dx = 1, dy = 1, dz = 1): Space {
	const r: Space = [];
	for (let x = 1; x < xn; ++x) {
		for (let y = 1; y < yn; ++y) {
			for (let z = 1; z < zn; ++z) {
				r.push(vec3(x * dx, y * dy, z * dz));
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
): Space {
	const r: Space = [];
	for (let x = 1; x < xn; ++x) {
		for (let y = 1; y < yn; ++y) {
			for (let z = 1; z < zn; ++z) {
				r.push(vec3(dx(x), dy(y), dz(z)));
			}
		}
	}
	return r;
}

function rotate(v: Space, angle: number) {
	const R_y = fromArray([
		[Math.cos(angle), 0, Math.sin(angle)],
		[0, 1, 0],
		[-Math.sin(angle), 0, Math.cos(angle)]
	]);

	return v.map((b) => {
		const m = fromArray([[b.x], [b.y], [b.z]]);
		const r = R_y.mul(m).getVector(0);
		return r;
	});
}

// Take the last output as directional vector
function pipe(...mat: Space[]): Space {
	return mat.reduce((r, next) => r.flatMap((k) => move(next, k)), mat.shift() ?? []);
}

function reduce_pos(v: Space): Space {
	return embed(v, v);
}

function round_pos(v: Space): Space {
	return v.map((k) => k.map(Math.round));
}

export {
	put,
	round_pos,
	scale,
	diffusion,
	rotate,
	swap,
	embed,
	move,
	center,
	moveTo,
	pipe,
	array_gen,
	array_gen_fn,
	reduce_pos
};

import { Vec3, Space, vec3, put } from './vector.js';
import { LSystem } from './lsystem.js';

// Universal configs : block, origin, player, dimension, env , facing , hollow?

function sphere(radius: number, inner_radius: number): Space {
	const result: Space = [];
	for (let x = -radius; x <= radius; x++) {
		for (let y = -radius; y <= radius; y++) {
			for (let z = -radius; z <= radius; z++) {
				if (
					x * x + y * y + z * z <= radius * radius &&
					x * x + y * y + z * z >= inner_radius * inner_radius
				) {
					result.push(vec3(x, y, z));
				}
			}
		}
	}
	return result;
}

function circle(radius: number, inner_radius: number): Space {
	const result: Space = [];
	for (let x = -radius; x <= radius; x++) {
		for (let z = -radius; z <= radius; z++) {
			if (x * x + z * z <= radius * radius && x * x + z * z >= inner_radius * inner_radius) {
				result.push(vec3(x, 0, z));
			}
		}
	}
	return result;
}

function torus(radius: number, ringRadius: number): Space {
	const result: Space = [];
	for (let x = -radius - ringRadius; x <= radius + ringRadius; x++) {
		for (let z = -radius - ringRadius; z <= radius + ringRadius; z++) {
			const xz_distance = Math.sqrt(x * x + z * z);
			if (xz_distance > 0) {
				const rx = (x / xz_distance) * ringRadius;
				const rz = (z / xz_distance) * ringRadius;
				const rd = Math.sqrt(x - rx) + Math.sqrt(z - rz);
				for (let y = -radius - ringRadius; y <= radius + ringRadius; y++) {
					if (rd + z * z <= radius * radius) {
						result.push(vec3(x, y, z));
					}
				}
			}
		}
	}
	return result;
}

function lineVoxel(p1: Vec3, p2: Vec3): Space {
	const [dx, dy, dz] = [Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y), Math.abs(p2.z - p1.z)];
	const [sx, sy, sz] = [p1.x < p2.x ? 1 : -1, p1.y < p2.y ? 1 : -1, p1.z < p2.z ? 1 : -1];
	let [x, y, z] = [p1.x, p1.y, p1.z];
	const points: Space = [];

	if (dx >= dy && dx >= dz) {
		let err1 = dy - dx;
		let err2 = dz - dx;
		while (x != p2.x) {
			points.push(put([x, y, z]));
			if (err1 > 0) {
				y += sy;
				err1 -= 2 * dx;
			}
			if (err2 > 0) {
				z += sz;
				err2 -= 2 * dx;
			}
			x += sx;
			err1 += 2 * dy;
			err2 += 2 * dz;
		}
	} else if (dy >= dx && dy >= dz) {
		let err1 = dx - dy;
		let err2 = dz - dy;
		while (y != p2.y) {
			points.push(put([x, y, z]));
			if (err1 > 0) {
				x += sx;
				err1 -= 2 * dy;
			}
			if (err2 > 0) {
				z += sz;
				err2 -= 2 * dy;
			}
			y += sy;
			err1 += 2 * dx;
			err2 += 2 * dz;
		}
	} else {
		let err1 = dy - dz;
		let err2 = dx - dz;
		while (z != p2.z) {
			points.push(put([x, y, z]));
			if (err1 > 0) {
				y += sy;
				err1 -= 2 * dz;
			}
			if (err2 > 0) {
				x += sx;
				err2 -= 2 * dz;
			}
			z += sz;
			err1 += 2 * dy;
			err2 += 2 * dx;
		}
	}
	points.push(put([x, y, z]));

	return points;
}

function line(p1: Vec3, p2: Vec3): Space {
	const [dx, dy, dz] = [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z];
	const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
	const stepX = dx / steps;
	const stepY = dy / steps;
	const stepZ = dz / steps;
	const points: Space = [];

	for (let i = 0; i <= steps; ++i) {
		const x = p1.x + i * stepX;
		const y = p1.y + i * stepY;
		const z = p1.z + i * stepZ;
		points.push(vec3(x, y, z));
	}

	return points;
}

function triangle(p1: Vec3, p2: Vec3, p3: Vec3): Space {
	const base = line(p1, p2);
	const fill = base.flatMap((point) => line(point, p3));
	return [...base, ...fill];
}

function triangleVoxel(p1: Vec3, p2: Vec3, p3: Vec3): Space {
	const base = lineVoxel(p1, p2);
	const fill = base.flatMap((point) => lineVoxel(point, p3));
	return [...base, ...fill];
}

function turtle(actions: string) {
	const lsys = new LSystem(actions, {});
	return lsys.runProc();
}

export { sphere, circle, torus, lineVoxel, line, triangle, triangleVoxel, turtle };

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

// https://replit.com/@Michael_Nicol/Bresenhams-Algorithm#index.js
function voxelLine(p1: Vec3, p2: Vec3): Space {
	const [x1, y1, z1] = [p1.x, p1.y, p1.z];
	const [x2, y2, z2] = [p2.x, p2.y, p2.z];
	let [dx, dy, dz] = [x2 - x1, y2 - y1, z2 - z1];
	const qChange = [dx, dy, dz].map(Math.sign);
	[dx, dy, dz] = [dx, dy, dz].map(Math.abs);

	const largestChange = [dy, dx, dz].indexOf(Math.max(dy, dx, dz));
	const largestTarget = Math.max(dy, dx, dz);
	const startAxis = [x1, y1, z1][largestChange];

	let [x, y, z] = [x1, y1, z1];
	const points: Space = [];
	let [rx, ry, rz] = [0, 0, 0];

	const endCoord =
		qChange[largestChange] === 1 ? startAxis + largestTarget : startAxis - largestTarget;
	for (
		let i = startAxis;
		qChange[largestChange] === 1 ? i <= endCoord : i >= endCoord;
		i += qChange[largestChange]
	) {
		if (largestChange === 0) {
			if (ry >= dx) {
				ry -= dx;
				y += qChange[1];
			}
			if (rz >= dx) {
				rz -= dx;
				z += qChange[2];
			}
			ry += dy;
			rz += dz;
			points.push(put([i, y, z]));
		} else if (largestChange === 1) {
			if (rx >= dy) {
				rx -= dy;
				x += qChange[0];
			}
			if (rz >= dy) {
				rz -= dy;
				z += qChange[2];
			}
			rx += dx;
			rz += dz;
			points.push(put([x, i, z]));
		} else if (largestChange === 2) {
			if (rx >= dz) {
				rx -= dz;
				x += qChange[2];
			}
			if (ry >= dz) {
				ry -= dz;
				y += qChange[1];
			}
			rx += dx;
			ry += dy;
			points.push(put([x, y, i]));
		}
	}
	return points;
}

function line(a: Vec3, b: Vec3, acc: number): Space {
	const dv = b.subtract(a);
	return [b].concat(
		Array(Math.floor(1 / acc))
			.fill(0)
			.map((_, i) => a.add(dv.scale(i * acc)))
	);
}

function triangle(p1: Vec3, p2: Vec3, p3: Vec3, acc: number): Space {
	const base = line(p1, p2, acc);

	const fill = base.flatMap((point) => line(point, p3, acc));

	return [...base, ...fill];
}

function turtle(actions: string) {
	const lsys = new LSystem(actions, {});
	return lsys.runProc();
}

export { sphere, circle, torus, voxelLine, line, triangle, turtle };

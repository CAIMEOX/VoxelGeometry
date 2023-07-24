import { Vec3, Space, vec3 } from './vector.js';
import { round_pos } from './transform.js';
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

function line(p1: Vec3, p2: Vec3, resolution: number): Space {
	const [dx, dy, dz] = [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z];
	const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) * resolution;
	const stepX = dx / steps;
	const stepY = dy / steps;
	const stepZ = dz / steps;
	const points: Space = [p2];

	for (let i = 0; i <= steps; ++i) {
		const x = p1.x + i * stepX;
		const y = p1.y + i * stepY;
		const z = p1.z + i * stepZ;
		points.push(vec3(x, y, z));
	}

	return points;
}

function lineVoxel(p1: Vec3, p2: Vec3): Space {
	return round_pos(line(p1, p2, 1.2));
}

function triangle(p1: Vec3, p2: Vec3, p3: Vec3, acc: number): Space {
	const basel = line(p1, p2, acc);
	const baser = line(p1, p3, acc);
	const fill = basel.flatMap((p, i) => line(p, baser[i], acc));
	return [...basel, ...baser, ...fill];
}

function triangleVoxel(p1: Vec3, p2: Vec3, p3: Vec3): Space {
	return round_pos(triangle(p1, p2, p3, 1.2));
}

function turtle(actions: string) {
	const lsys = new LSystem(actions, {});
	return lsys.runProc();
}

export { sphere, circle, torus, lineVoxel, line, triangle, triangleVoxel, turtle };

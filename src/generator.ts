import { Vec3 } from "./vector";
import { LSystem } from "./lsystem";
import { put } from "./transform";

// Universal configs : block, origin, player, dimension, env , facing , hollow?

function sphere(radius: number, inner_radius: number): Vec3[] {
  const result: Vec3[] = [];
  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      for (let z = -radius; z <= radius; z++) {
        if (
          x * x + y * y + z * z <= radius * radius &&
          x * x + y * y + z * z >= inner_radius * inner_radius
        ) {
          result.push(new Vec3(x, y, z));
        }
      }
    }
  }
  return result;
}

function circle(radius: number, inner_radius: number): Vec3[] {
  const result: Vec3[] = [];
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      if (
        x * x + z * z <= radius * radius &&
        x * x + z * z >= inner_radius * inner_radius
      ) {
        result.push(new Vec3(x, 0, z));
      }
    }
  }
  return result;
}

function torus(radius: number, ringRadius: number): Vec3[] {
  const result: Vec3[] = [];
  for (let x = -radius - ringRadius; x <= radius + ringRadius; x++) {
    for (let z = -radius - ringRadius; z <= radius + ringRadius; z++) {
      const xz_distance = Math.sqrt(x * x + z * z);
      if (xz_distance > 0) {
        const rx = (x / xz_distance) * ringRadius;
        const rz = (z / xz_distance) * ringRadius;
        const rd = Math.sqrt(x - rx) + Math.sqrt(z - rz);
        for (let y = -radius - ringRadius; y <= radius + ringRadius; y++) {
          if (rd + z * z <= radius * radius) {
            result.push(new Vec3(x, y, z));
          }
        }
      }
    }
  }
  return result;
}

// https://replit.com/@Michael_Nicol/Bresenhams-Algorithm#index.js
const line = (p1: Vec3, p2: Vec3) => {
  const [x1, y1, z1] = [p1.x, p1.y, p1.z];
  const [x2, y2, z2] = [p2.x, p2.y, p2.z];
  let dy = y2 - y1;
  let dx = x2 - x1;
  let dz = z2 - z1;
  const qChange = [dx < 0 ? -1 : 1, dy < 0 ? -1 : 1, dz < 0 ? -1 : 1];
  dx = Math.abs(dx);
  dy = Math.abs(dy);
  dz = Math.abs(dz);
  let largestChange;
  if (dy >= dz && dy >= dx) {
    largestChange = 1;
  } else if (dx >= dy && dx >= dz) {
    largestChange = 0;
  } else {
    largestChange = 2;
  }
  const largestTarget = Math.max(dy, dx, dz);
  const startAxis = largestChange === 1 ? y1 : largestChange === 0 ? x1 : z1;
  let x = x1;
  let y = y1;
  let z = z1;
  const points: Vec3[] = [];
  let rx = 0;
  let ry = 0;
  let rz = 0;
  const endCoord =
    qChange[largestChange] === 1
      ? startAxis + largestTarget
      : startAxis - largestTarget;
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
      continue;
    }
    if (largestChange === 1) {
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
      continue;
    }
    if (largestChange === 2) {
      if (rx >= dz) {
        rx -= dz;
        x += qChange[2];
      }
      if (ry >= dz) {
        ry -= dz;
        y += qChange[1];
      }
      ry += dy;
      rx += dx;
      points.push(put([x, y, i]));
      continue;
    }
  }
  return points;
};

function turtle(actions: string) {
  const lsys = new LSystem(actions, {});
  return lsys.runProc();
}

export { sphere, circle, line, torus, turtle };

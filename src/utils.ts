import { Vec3 } from "./vector";

function BAdd(p1: Vec3, p2: Vec3): Vec3 {
  return new Vec3(p1.x + p2.x, p1.y + p2.y, p2.z + p2.z);
}

function BMul(p: Vec3, k: number): Vec3 {
  return new Vec3(p.x * k, p.y * k, p.z * k);
}

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getDistance(p1: Vec3, p2: Vec3): number {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) +
      (p1.y - p2.y) * (p1.y - p2.y) +
      (p1.z - p2.z) * (p1.z - p2.z)
  );
}

function rand(): number {
  const p = Math.random();
  if (p > 0.5) return Math.random();
  else return -Math.random();
}

export { rand, BAdd, BMul, random, getDistance };

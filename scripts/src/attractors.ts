import { BlockLocation } from "@minecraft/server";

function clifford_attractor(x: number, z: number, a: number, b: number, c: number, d: number) {
  const res = [];
  for (let t = 0; t < 10000; t++) {
    const x1 = Math.sin(a * z) + c * Math.cos(a * x);
    const z1 = Math.sin(b * x) + d * Math.cos(b * z);
    res.push(new BlockLocation(x1, 0, z1));
  }
  return res;
}

export { clifford_attractor };

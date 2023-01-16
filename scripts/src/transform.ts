import { Block, BlockLocation } from "@minecraft/server";
import { construct, operation } from "./lineamp";

enum Direction {
  X = 0,
  Y,
  Z,
}

function embed(base: BlockLocation[], target: BlockLocation[]) {
  let xT: Map<number, Map<number, void>> = new Map();
  base.map((v) => {
    if (!xT.has(v.x)) xT.set(v.x, new Map());
    xT.get(v.x)!.set(v.z);
  });
  return target.filter((v) => xT.has(v.x) && xT.get(v.x)!.has(v.z));
}

// Swap The Direction of the Structure
function swap(v: BlockLocation[], d1: number, d2: number): BlockLocation[] {
  return v.map((b) => {
    let k = view(b);
    [k[d1], k[d2]] = [k[d2], k[d1]];
    return put(k);
  });
}

function view(v: BlockLocation) {
  return [v.x, v.y, v.z];
}

function put(k: number[]) {
  return new BlockLocation(k[0], k[1], k[2]);
}

function scale(v: BlockLocation[], size: number) {}

function rotate(v: BlockLocation[], d: Direction, angle: number) {
  let R_y = construct.fromArray([
    [Math.cos(angle), 0, Math.sin(angle)],
    [0, 1, 0],
    [-Math.sin(angle), 0, Math.cos(angle)],
  ]);

  return v.map((b) => {
    let m = construct.fromArray([[b.x], [b.y], [b.z]]);
    let r = operation.mul(R_y, m).matrix[0];
    return new BlockLocation(r[0], r[1], r[2]);
  });
}

export { scale, rotate, swap, embed };

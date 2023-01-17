import { BlockLocation } from "@minecraft/server";

function expression(expr: string, start: number, end: number, step: number = 1, k: number): BlockLocation[] {
  if (start > end) [start, end] = [end, start];
  let result: BlockLocation[] = [];
  const f = new Function("x", "y", "z", `return ${expr}`);
  for (let x = start; x <= end; x += step)
    for (let y = start; y <= end; y += step)
      for (let z = start; z <= end; z += step)
        if (f(x, y, z)) result.push(new BlockLocation(Math.trunc(k * x), Math.trunc(k * y), Math.trunc(k * z)));
  return result;
}
export { expression };

/* eslint-disable @typescript-eslint/ban-types */
import { BlockLocation } from "@minecraft/server";

function simple_equation(expr: string, start: number, end: number, step = 1, k = 1): BlockLocation[] {
  if (start > end) [start, end] = [end, start];
  const result: BlockLocation[] = [];
  const f = new Function("x", "y", "z", `return ${expr}`);
  for (let x = start; x <= end; x += step)
    for (let y = start; y <= end; y += step)
      for (let z = start; z <= end; z += step)
        if (f(x, y, z)) result.push(new BlockLocation(Math.trunc(k * x), Math.trunc(k * y), Math.trunc(k * z)));
  return result;
}

function equation(
  expr: string,
  [xstart, xend, xstep]: [number, number, number],
  [ystart, yend, ystep]: [number, number, number],
  [zstart, zend, zstep]: [number, number, number],
  k = 1
): BlockLocation[] {
  if (xstart > xend) [xstart, xend] = [xend, xstart];
  if (ystart > yend) [ystart, yend] = [yend, ystart];
  if (zstart > zend) [zstart, zend] = [zend, zstart];
  const result: BlockLocation[] = [];
  const f = new Function("x", "y", "z", `return ${expr}`);
  for (let x = xstart; x <= xend; x += xstep)
    for (let y = ystart; y <= yend; y += ystep)
      for (let z = zstart; z <= zend; z += zstep)
        if (f(x, y, z)) result.push(new BlockLocation(Math.trunc(k * x), Math.trunc(k * y), Math.trunc(k * z)));
  return result;
}

interface varObject {
  name: string;
  varname: string;
  expr: string;
  define: [start: number, end: number, step: number];
}

//https://github.com/PureEval/PureEval/blob/main/src/iterate.js
function __boom(args: any[][]): any[] {
  // @ts-ignore
  let now = args.shift().map((x) => [x]),
    upper: any[][] = [];
  args.forEach((v) => {
    v.forEach((u) => now.forEach((x) => upper.push([...x, u])));
    now = [...upper];
    upper = [];
  });
  return now;
}

function parametric(exprx: string, expry: string, exprz: string, ...vars: varObject[]): BlockLocation[] {
  const arg: string[] = vars.map((v) => v.name);
  const funs: Function[] = vars.map((v) => new Function(v.varname, `return ${v.expr}`));
  const summoner: number[][] = vars.map((v) => {
    const [start, end, step] = v.define;
    return new Array((end - start) / step).fill(start).map((v, i) => start + i * step);
  });
  const [costx, costy, costz] = [
    new Function(...arg, `return ${exprx}`),
    new Function(...arg, `return ${expry}`),
    new Function(...arg, `return ${exprz}`),
  ];
  return __boom(summoner).map((v) => {
    const values = funs.map((f, i) => f(v[i]));
    return new BlockLocation(costx(...values), costy(...values), costz(...values));
  });
}

type Interval = number | string;

function simple_parametric(exprx: string, expry: string, exprz: string, ...intervals: Interval[][]): BlockLocation[] {
  const vars: varObject[] = intervals.map((v) => {
    return {
      name: v.shift() as string,
      varname: "p",
      expr: "p",
      define: [v[0] as number, v[1] as number, v[2] as number],
    };
  });
  return parametric(exprx, expry, exprz, ...vars);
}

function ellipse(a: number, b: number): BlockLocation[] {
  return simple_parametric(a.toString() + "*Math.cos(t)", "1", b.toString() + "*Math.cos(t)", ["t", 0, Math.PI * 2]);
}

export { simple_equation, equation, parametric, simple_parametric, ellipse };

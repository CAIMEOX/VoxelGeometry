import { Vec3 } from "./vector.js";
declare function equation(expr: string, [xstart, xend, xstep]: [number, number, number], [ystart, yend, ystep]: [number, number, number], [zstart, zend, zstep]: [number, number, number]): Vec3[];
declare function simple_equation(expr: string, start: number, end: number, step?: number): Vec3[];
interface varObject {
    name: string;
    varname: string;
    expr: string;
    define: [start: number, end: number, step: number];
}
declare function parametric(exprx: string, expry: string, exprz: string, ...vars: varObject[]): Vec3[];
type Interval = string | number;
declare function simple_parametric(exprx: string, expry: string, exprz: string, ...intervals: Interval[][]): Vec3[];
declare function ellipse(a: number, b: number, step: number): Vec3[];
declare function helix(a: number, b: number, period: number, step: number): Vec3[];
declare function knot(p: number, q: number, step: number): Vec3[];
export { ellipse, knot, simple_equation, equation, parametric, simple_parametric, helix, };

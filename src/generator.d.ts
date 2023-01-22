import { Vec3 } from "./vector";
declare function sphere(radius: number, inner_radius: number): Vec3[];
declare function circle(radius: number, inner_radius: number): Vec3[];
declare function torus(radius: number, ringRadius: number): Vec3[];
declare const line: (p1: Vec3, p2: Vec3) => Vec3[];
declare function turtle(actions: string): Vec3[];
export { sphere, circle, line, torus, turtle };

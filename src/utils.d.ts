import { Vec3 } from "./vector.js";
declare function BAdd(p1: Vec3, p2: Vec3): Vec3;
declare function BMul(p: Vec3, k: number): Vec3;
declare function random(min: number, max: number): number;
declare function rand(): number;
export { rand, BAdd, BMul, random };

import { Vec3 } from "./vector.js";
declare function DLA2D(width: number, maxWalk: number, iterations: number, step: number, Temperature: number, stuck?: Vec3[], summoner?: (width: number) => number[]): Vec3[];
export { DLA2D };

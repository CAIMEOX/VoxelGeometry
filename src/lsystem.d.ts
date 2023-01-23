import { Vec3 } from "./vector.js";
export declare class LSystem {
    axiom: string;
    rules: {
        [key: string]: string;
    };
    env: {
        [key: string]: any;
    };
    symbols: string[];
    constructor(axioms: string, rules: {
        [key: string]: string;
    }, symbols?: string[]);
    generate(n: number): string;
    iterate(str: string): string;
    setEnv(key: string, v: any): void;
    runProc(proc?: {
        [key: string]: Function;
    }): Vec3[];
}
declare function lsystem(axiom: string, rules: {
    [key: string]: string;
}, generation?: number, angle?: number): Vec3[];
declare function leaf(n: number): Vec3[];
declare function triangle(n: number): Vec3[];
declare function quadratic_gosper(n: number): Vec3[];
declare function square_sierpinski(n: number): Vec3[];
declare function crystal(n: number): Vec3[];
declare function peano_curve(n: number): Vec3[];
declare function quadratic_snowflake_square(n: number): Vec3[];
declare function rings(n: number): Vec3[];
export { lsystem, leaf, triangle, quadratic_gosper, square_sierpinski, crystal, peano_curve, quadratic_snowflake_square, rings, };

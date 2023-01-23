import { Vec3 } from "./vector.js";
declare class Matrix {
    matrix: Array<Array<number>>;
    row: number;
    column: number;
    constructor(r: number, c: number, val?: number);
    swap_row(a: number, b: number): void;
    swap_column(a: number, b: number): void;
    map(r: number, f: (v: number) => number): void;
    add(a: number, b: number, k: number): void;
    fliphorizontal(): void;
    flipvertica(): void;
    flipmdiagonal(): void;
    flipsdiagonal(): void;
    getVector(row: number): Vec3;
    getVectorCol(col: number): Vec3;
    toString(): string;
}
declare namespace construct {
    function unit(n: number): Matrix;
    function fromArray(A: Array<Array<number>>): Matrix;
}
declare namespace operation {
    function add(a: Matrix, b: Matrix): Matrix;
    function sub(a: Matrix, b: Matrix): Matrix;
    function mul(a: Matrix, b: Matrix): Matrix;
    function pow(a: Matrix, p: number): Matrix;
    function equal(a: Matrix, b: Matrix): boolean;
}
export { Matrix, operation, construct };

import { Vec3 } from "./vector.js";
declare class IFS {
    fractal: number[][];
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    offsetX: number;
    offsetY: number;
    height: number;
    width: number;
    track: Vec3[];
    constructor(f: number[], width?: number, height?: number);
    readIfs(f: number[]): void;
    run(n: number): Vec3[];
    next(): number;
    findBounds(): void;
}
declare function create_IFS(f: number[], width: number, height: number): IFS;
declare namespace Fractals {
    const anchors: number[];
    const angle: number[];
    const babylon: number[];
    const batman: number[];
    const boomerang: number[];
    const c: number[];
    const cantor: number[];
    const castle: number[];
    const claw: number[];
    const cloud: number[];
    const cloud1: number[];
    const coral: number[];
    const coral1: number[];
    const coral2: number[];
    const coral3: number[];
    const coral4: number[];
    const cosmos: number[];
    const crystal: number[];
    const crystal1: number[];
    const crystal2: number[];
    const crystal3: number[];
    const crystal4: number[];
    const curl: number[];
    const devil: number[];
    const dogs: number[];
    const dragon: number[];
    const dragon1: number[];
    const dragon2: number[];
    const dragons: number[];
    const fern: number[];
    const fern1: number[];
    const fern2: number[];
    const floor: number[];
    const floor1: number[];
    const floor2: number[];
    const flyfish: number[];
    const forest: number[];
    const fournier: number[];
    const island: number[];
    const klingon: number[];
    const koch43: number[];
    const koch53: number[];
    const kochmix: number[];
    const leaf: number[];
    const leaf1: number[];
    const leaf2: number[];
    const m: number[];
    const menger: number[];
    const onefive: number[];
    const paw: number[];
    const pentagon: number[];
    const petals: number[];
    const petals1: number[];
    const posies: number[];
    const posies1: number[];
    const posies2: number[];
    const posies3: number[];
    const ribbon: number[];
    const sails: number[];
    const satdish: number[];
    const schain: number[];
    const sierpinski: number[];
    const sigma: number[];
    const sphinx: number[];
    const spiral: number[];
    const spiral1: number[];
    const spiral2: number[];
    const spiral3: number[];
    const square: number[];
    const sticks: number[];
    const swirl: number[];
    const tower: number[];
    const tree: number[];
    const tree1: number[];
    const tree2: number[];
    const tree3: number[];
    const twig: number[];
    const twig1: number[];
    const vortex: number[];
    const wind: number[];
    const wreath: number[];
}
export { create_IFS, Fractals };

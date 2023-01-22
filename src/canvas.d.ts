import { Vec3 } from "./vector";
declare class Transform {
    context: Context;
    matrix: Array<number>;
    stack: any[];
    m: number[];
    constructor(context: Context);
    setContext(context: any): void;
    getMatrix(): number[];
    setMatrix(m: number[]): void;
    cloneMatrix(m: any[]): any[];
    save(): void;
    restore(): void;
    setTransform(): void;
    translate(x: number, y: number): void;
    rotate(rad: number): void;
    scale(sx: number, sy: number): void;
    rotateDegrees(deg: number): void;
    rotateAbout(rad: number, x: number, y: number): void;
    rotateDegreesAbout(deg: any, x: number, y: number): void;
    identity(): void;
    multiply(matrix: {
        m: number[];
    }): void;
    invert(): void;
    transformPoint(pt: {
        x: any;
        y: any;
    }): Point;
}
declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
declare class Bitmap {
    width: number;
    height: number;
    data: Vec3[];
    constructor(w: number, h: number);
    dot(x: number, y: number): void;
    getContext(): Context;
    getBlocks(): Vec3[];
}
declare class Context {
    bitmap: any;
    _lineWidth: number;
    transform: Transform;
    _clip: Line[] | null;
    path: (string | Point | object)[];
    pathstart: any;
    constructor(bitmap: Bitmap);
    save(): void;
    translate(x: any, y: any): void;
    rotate(angle: any): void;
    scale(sx: any, sy: any): void;
    restore(): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    clearRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    getImageData(): any;
    beginPath(): void;
    moveTo(x: any, y: any): void;
    _moveTo(pt: Point): void;
    lineTo(x: any, y: any): void;
    _lineTo(pt: Point): void;
    quadraticCurveTo(cp1x: any, cp1y: any, x: any, y: any): void;
    bezierCurveTo(cp1x: any, cp1y: any, cp2x: any, cp2y: any, x: any, y: any): void;
    _bezierCurveTo(cp1: Point, cp2: Point, pt: Point): void;
    arc(x: number, y: number, rad: number, start: number, end: number, clockwise: any): void;
    clip(): void;
    closePath(): void;
    stroke(): void;
    drawLine(line: {
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
    }): void;
    fill(): void;
    pixelInsideClip(x: number, y: number): boolean;
}
declare class Line {
    start: Point;
    end: Point;
    constructor(start: Point, end: Point);
    getLength(): number;
}
export { Transform, Context, Bitmap, Point, Line };

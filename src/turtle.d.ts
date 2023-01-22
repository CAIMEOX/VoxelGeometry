import { Vec3 } from "./vector";
import { Matrix } from "./lineamp";
declare class Turtle2D {
    x: number;
    y: number;
    angle: number;
    thickness: number;
    pen: boolean;
    stack: {
        x: number;
        y: number;
        angle: number;
        pen: boolean;
        thickness: number;
    }[];
    track: Array<Vec3>;
    constructor();
    penUp(): void;
    penDown(): void;
    left(): void;
    right(): void;
    rotate(angle: number): void;
    push(): void;
    pop(): void;
    goto(x: number, y: number): void;
    width(width: number): void;
    dot(x: number, y: number): void;
    line(x1: number, y1: number): void;
    forward(distance: number): void;
    backward(distance: number): void;
    getTrack(): Vec3[];
}
declare class Turtle3D {
    pos: Vec3;
    pen: boolean;
    mat: Matrix;
    stack: {
        pos: Vec3;
        mat: Matrix;
    }[];
    track: Vec3[];
    constructor(compass?: number, vertical?: number, roll?: number);
    penUp(): void;
    penDown(): void;
    pop(): void;
    push(): void;
    RotateU(a: number): Matrix;
    RotateL(a: number): Matrix;
    RotateH(a: number): Matrix;
    goto(x: number, y: number, z: number): void;
    makeMatrix(compass: number, vertical: number, roll: number): Matrix;
    getHeading(): Vec3;
    getAngles(): number[];
    roll(a: number): void;
    pitch(a: number): void;
    yaw(a: number): void;
    right(a: number): void;
    left(a: number): void;
    forward(d: number): void;
    backward(d: number): void;
    getTrack(): Vec3[];
}
export { Turtle2D, Turtle3D };

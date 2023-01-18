import { BlockLocation } from "@minecraft/server";

class Point {
  x: number;
  y: number;
  Stucked: boolean = false;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  #Vary(steplength: number) {
    return [this.x + Math.random() * steplength, this.y + Math.random() * steplength];
  }
  Walk(width: number, steplength: number) {
    let [tox, toy] = this.#Vary(steplength);
    while (tox < 0 || tox > width || toy < 0 || toy > width) {
      [tox, toy] = this.#Vary(steplength);
    }
    [this.x, this.y] = [tox, toy];
  }
}

class DLASystem {
  width: number;
  maxWalk: number;
  iterations: number;
  Walkering: Point[];
  Stucked: Point[];

  constructor(width: number, maxWalk: number, iterations: number) {
    this.width = width;
    this.maxWalk = maxWalk;
    this.iterations = iterations;
    this.Stucked.push(new Point(this.width / 2, this.width / 2));
    while (this.Walkering.length < maxWalk) {
      this.Walkering.push(randPoint(this.width));
    }
  }

  run(): BlockLocation[] {
    while (this.Walkering) {
      for (let i = 1; i <= this.iterations; ++i) {
        for (let j = 0; j < this.Walkering.length; ++j) {
          if (this.Walkering[j].Stucked === true) continue;
          this.Walkering[j].Walk(this.width, this.width);
          for (let k = 0; k < this.Stucked.length; ++k) {
            if (checkStuck(this.Walkering[j], this.Stucked[k])) {
              this.Walkering[j].Stucked = true;
              this.Stucked.push(this.Walkering[j]);
              break;
            }
          }
        }
        this.Walkering = this.Walkering.filter((v) => v.Stucked === false);
      }
    }
    return this.Stucked.map((v) => new BlockLocation(v.x, 0, v.y));
  }
}

function randPoint(width: number): Point {
  return new Point(Math.random() * width, Math.random() * width);
}

function distance(a: Point, b: Point): number {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

function checkStuck(a: Point, b: Point): boolean {
  return distance(a, b) < 1;
}

function DLA(width: number, maxWalk: number, iterations: number): BlockLocation[] {
  const sys = new DLASystem(width, maxWalk, iterations);
  return sys.run();
}

export { DLA };
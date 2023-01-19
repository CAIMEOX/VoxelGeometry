import { BlockLocation } from "@minecraft/server";
import { rand } from "./utils";

class Point {
  x: number;
  y: number;
  Stucked = false;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  private Vary(steplength: number) {
    return [this.x + rand() * steplength, this.y + rand() * steplength];
  }
  Walk(width: number, steplength: number) {
    let [tox, toy] = this.Vary(steplength);
    while (Math.abs(tox) > width / 2 || Math.abs(toy) > width / 2) {
      [tox, toy] = this.Vary(steplength);
    }
    [this.x, this.y] = [tox, toy];
  }
}

class DLASystem {
  width: number;
  maxWalk: number;
  iterations: number;
  step: number;
  Temperature: number;
  Walkering: Point[];
  Stucked: Point[];
  summoner: (width: number) => number[];

  constructor(
    width: number,
    maxWalk: number,
    iterations: number,
    step: number,
    Temperature: number,
    stuck: BlockLocation[] = [],
    summoner: (width: number) => number[] = randPoint
  ) {
    this.width = width;
    this.maxWalk = maxWalk;
    this.iterations = iterations;
    this.Temperature = Temperature;
    this.Walkering = [];
    this.Stucked = [];
    this.step = step;
    this.summoner = summoner;
    if (stuck.length === 0) this.Stucked.push(new Point(0, 0));
    else this.Stucked = stuck.map((v) => new Point(v.x, v.z));
    while (this.Walkering.length < maxWalk) {
      this.Walkering.push(toPoint(randPoint(this.width)));
    }
  }

  run(): BlockLocation[] {
    while (this.Walkering.length) {
      for (let i = 1; i <= this.iterations; ++i) {
        for (let j = 0; j < this.Walkering.length; ++j) {
          if (this.Walkering[j].Stucked === true) continue;
          this.Walkering[j].Walk(this.width, 1);
          for (let k = 0; k < this.Stucked.length; ++k) {
            if (checkStuck(this.Walkering[j], this.Stucked[k], this.step)) {
              this.Walkering[j].Stucked = true;
              this.Stucked.push(this.Walkering[j]);
              break;
            }
          }
        }
        this.Walkering = this.Walkering.filter((v) => v.Stucked === false);
      }
      while (this.Walkering.length < this.maxWalk && this.Temperature > 1) {
        this.Walkering.push(toPoint(randPoint(this.width)));
        this.Temperature *= 0.995;
      }
    }
    return this.Stucked.map((v) => new BlockLocation(Math.round(v.x), 0, Math.round(v.y)));
  }
}

function randPoint(width: number): number[] {
  return [rand() * (width / 2), rand() * (width / 2)];
}

function distance(a: Point, b: Point): number {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

function checkStuck(a: Point, b: Point, step: number): boolean {
  return distance(a, b) < 1.8 * step;
}

function toPoint(arr: number[]): Point {
  return new Point(arr[0], arr[1]);
}

function DLA2D(
  width: number,
  maxWalk: number,
  iterations: number,
  step: number,
  Temperature: number,
  stuck: BlockLocation[] = [],
  summoner: (width: number) => number[] = randPoint
): BlockLocation[] {
  const sys = new DLASystem(width, maxWalk, iterations, step, Temperature, stuck, summoner);
  return sys.run();
}

export { DLA2D };

import { Vec3 } from "./vector.js";
import { rand } from "./utils.js";
class Point {
    constructor(x, y, z) {
        this.Stucked = false;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vary(steplength) {
        return [
            this.x + rand() * steplength,
            this.y + rand() * steplength,
            this.z + rand() * steplength,
        ];
    }
    Walk(width, steplength) {
        let [tox, toy, toz] = this.Vary(steplength);
        while (Math.abs(tox) > width / 2 ||
            Math.abs(toy) > width / 2 ||
            Math.abs(toz) > width / 2) {
            [tox, toy, toz] = this.Vary(steplength);
        }
        [this.x, this.y, this.z] = [tox, toy, toz];
    }
}
class DLASystem {
    constructor(width, maxWalk, iterations, step, Temperature, stuck = [], summoner = randPoint) {
        this.width = width;
        this.maxWalk = maxWalk;
        this.iterations = iterations;
        this.Temperature = Temperature;
        this.Walkering = [];
        this.Stucked = [];
        this.step = step;
        this.summoner = summoner;
        if (stuck.length === 0)
            this.Stucked.push(new Point(0, 0, 0));
        else
            this.Stucked = stuck.map((v) => new Point(v.x, v.y, v.z));
        while (this.Walkering.length < maxWalk) {
            this.Walkering.push(toPoint(this.summoner(this.width)));
        }
    }
    run() {
        while (this.Walkering.length) {
            for (let i = 1; i <= this.iterations; ++i) {
                for (let j = 0; j < this.Walkering.length; ++j) {
                    if (this.Walkering[j].Stucked === true)
                        continue;
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
                this.Walkering.push(toPoint(this.summoner(this.width)));
                this.Temperature *= 0.995;
            }
        }
        return this.Stucked.map((v) => new Vec3(v.x, v.y, v.z));
    }
}
function randPoint(width) {
    return [rand() * (width / 2), rand() * (width / 2), rand() * (width / 2)];
}
function distance(a, b) {
    return ((a.x - b.x) * (a.x - b.x) +
        (a.y - b.y) * (a.y - b.y) +
        (a.z - b.z) * (a.z - b.z));
}
function checkStuck(a, b, step) {
    return distance(a, b) < 1.8 * step;
}
function toPoint(arr) {
    return new Point(arr[0], arr[1], arr[2]);
}
function DLA3D(width, maxWalk, iterations, step, Temperature, stuck = [], summoner = randPoint) {
    const sys = new DLASystem(width, maxWalk, iterations, step, Temperature, stuck, summoner);
    return sys.run();
}
export { DLA3D };

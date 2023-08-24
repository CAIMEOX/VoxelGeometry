import { Space, vec3 } from './vector.js';
import { rand } from './utils.js';

class Point {
	x: number;
	y: number;
	stucked = false;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	private vary(steplength: number) {
		return [this.x + rand() * steplength, this.y + rand() * steplength];
	}

	walk(width: number, steplength: number) {
		let [tox, toy] = this.vary(steplength);
		while (Math.abs(tox) > width / 2 || Math.abs(toy) > width / 2) {
			[tox, toy] = this.vary(steplength);
		}
		[this.x, this.y] = [tox, toy];
	}
}

class DLASystem {
	width: number;
	maxWalk: number;
	iterations: number;
	step: number;
	temperature: number;
	walkering: Point[];
	stucked: Point[];
	summoner: (width: number) => number[];

	constructor(
		width: number,
		maxWalk: number,
		iterations: number,
		step: number,
		temperature: number,
		stuck: Space = [],
		summoner: (width: number) => number[] = randPoint
	) {
		this.width = width;
		this.maxWalk = maxWalk;
		this.iterations = iterations;
		this.temperature = temperature;
		this.walkering = [];
		this.stucked = [];
		this.step = step;
		this.summoner = summoner;
		if (stuck.length === 0) this.stucked.push(new Point(0, 0));
		else this.stucked = stuck.map((v) => new Point(v.x, v.z));
		while (this.walkering.length < maxWalk) {
			this.walkering.push(toPoint(randPoint(this.width)));
		}
	}

	run(): Space {
		while (this.walkering.length) {
			for (let i = 1; i <= this.iterations; ++i) {
				for (let j = 0; j < this.walkering.length; ++j) {
					if (this.walkering[j].stucked === true) continue;
					this.walkering[j].walk(this.width, 1);
					for (let k = 0; k < this.stucked.length; ++k) {
						if (checkStuck(this.walkering[j], this.stucked[k], this.step)) {
							this.walkering[j].stucked = true;
							this.stucked.push(this.walkering[j]);
							break;
						}
					}
				}
				this.walkering = this.walkering.filter((v) => v.stucked === false);
			}
			while (this.walkering.length < this.maxWalk && this.temperature > 1) {
				this.walkering.push(toPoint(randPoint(this.width)));
				this.temperature *= 0.995;
			}
		}
		return this.stucked.map((v) => vec3(v.x, 0, v.y));
	}
}

class DLASystemLazy {
	width: number;
	maxWalk: number;
	iterations: number;
	step: number;
	temperature: number;
	walkering: Point[];
	stucked: Point[];
	summoner: (width: number) => number[];

	constructor(
		width: number,
		maxWalk: number,
		iterations: number,
		step: number,
		temperature: number,
		stuck: Space = [],
		summoner: (width: number) => number[] = randPoint
	) {
		this.width = width;
		this.maxWalk = maxWalk;
		this.iterations = iterations;
		this.temperature = temperature;
		this.walkering = [];
		this.stucked = [];
		this.step = step;
		this.summoner = summoner;
		if (stuck.length === 0) this.stucked.push(new Point(0, 0));
		else this.stucked = stuck.map((v) => new Point(v.x, v.z));
		while (this.walkering.length < maxWalk) {
			this.walkering.push(toPoint(randPoint(this.width)));
		}
	}

	*run() {
		while (this.walkering.length) {
			for (let i = 1; i <= this.iterations; ++i) {
				for (let j = 0; j < this.walkering.length; ++j) {
					yield [this.walkering.length, this.stucked.length];
					if (this.walkering[j].stucked === true) continue;
					this.walkering[j].walk(this.width, 1);
					for (let k = 0; k < this.stucked.length; ++k) {
						if (checkStuck(this.walkering[j], this.stucked[k], this.step)) {
							this.walkering[j].stucked = true;
							this.stucked.push(this.walkering[j]);
							break;
						}
					}
				}
				this.walkering = this.walkering.filter((v) => v.stucked === false);
			}
			while (this.walkering.length < this.maxWalk && this.temperature > 1) {
				this.walkering.push(toPoint(randPoint(this.width)));
				this.temperature *= 0.995;
			}
		}
		yield this.stucked.map((v) => vec3(v.x, 0, v.y));
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

function toPoint([x, y]: number[]): Point {
	return new Point(x, y);
}

function DLA2D(
	width: number,
	maxWalk: number,
	iterations: number,
	step: number,
	Temperature: number,
	stuck: Space = [],
	summoner: (width: number) => number[] = randPoint
): Space {
	const sys = new DLASystem(width, maxWalk, iterations, step, Temperature, stuck, summoner);
	return sys.run();
}

function DLA2DLazy(
	width: number,
	maxWalk: number,
	iterations: number,
	step: number,
	Temperature: number,
	stuck: Space = [],
	summoner: (width: number) => number[] = randPoint
) {
	const sys = new DLASystemLazy(width, maxWalk, iterations, step, Temperature, stuck, summoner);
	return sys.run();
}

export { DLA2D, DLA2DLazy };

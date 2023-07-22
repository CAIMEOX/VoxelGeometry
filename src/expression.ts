/* eslint-disable @typescript-eslint/ban-types */
import { Vec3 } from './vector.js';

function equation(
	expr: string,
	[xstart, xend, xstep]: [number, number, number],
	[ystart, yend, ystep]: [number, number, number],
	[zstart, zend, zstep]: [number, number, number]
): Vec3[] {
	if (xstart > xend) [xstart, xend] = [xend, xstart];
	if (ystart > yend) [ystart, yend] = [yend, ystart];
	if (zstart > zend) [zstart, zend] = [zend, zstart];
	const result: Vec3[] = [];
	const f = new Function('x', 'y', 'z', `return ${expr}`);
	for (let x = xstart; x <= xend; x += xstep)
		for (let y = ystart; y <= yend; y += ystep)
			for (let z = zstart; z <= zend; z += zstep)
				if (f(x, y, z)) result.push(new Vec3(x, y, z));
	return result;
}

function simple_equation(expr: string, start: number, end: number, step = 1): Vec3[] {
	return equation(expr, [start, end, step], [start, end, step], [start, end, step]);
}

interface varObject {
	name: string;
	varname: string;
	expr: string;
	define: [start: number, end: number, step: number];
}

function parametric(exprx: string, expry: string, exprz: string, ...vars: varObject[]): Vec3[] {
	const arg: string[] = vars.map((v) => v.name);
	const funs: Function[] = vars.map((v) => new Function(v.varname, `return ${v.expr}`));
	const summoner: number[][] = vars.map((v) => {
		const [start, end, step] = v.define;
		return new Array(Math.floor((end - start) / step))
			.fill(start)
			.map((v, i) => start + i * step);
	});
	const [costx, costy, costz] = [
		new Function(...arg, `return ${exprx}`),
		new Function(...arg, `return ${expry}`),
		new Function(...arg, `return ${exprz}`)
	];
	return __boom(summoner).map((v) => {
		const values = funs.map((f, i) => f(v[i]));
		return new Vec3(costx(...values), costy(...values), costz(...values));
	});
}

//https://github.com/PureEval/PureEval/blob/main/src/iterate.js
function __boom(args: any[][]): any[] {
	// @ts-ignore
	let now = args.shift().map((x) => [x]),
		upper: any[][] = [];
	args.forEach((v) => {
		v.forEach((u) => now.forEach((x) => upper.push([...x, u])));
		now = [...upper];
		upper = [];
	});
	return now;
}

type Interval = string | number;

function simple_parametric(
	exprx: string,
	expry: string,
	exprz: string,
	...intervals: Interval[][]
): Vec3[] {
	const vars: varObject[] = intervals.map(([name, start, end, step]) => ({
		name: name as string,
		varname: 'p',
		expr: 'p',
		define: [start as number, end as number, step as number]
	}));
	return parametric(exprx, expry, exprz, ...vars);
}

function ellipse(a: number, b: number, step: number): Vec3[] {
	return simple_parametric(a.toString() + '*Math.cos(t)', '1', b.toString() + '*Math.sin(t)', [
		't',
		0,
		Math.PI * 2,
		step
	]);
}

function helix(a: number, b: number, period: number, step: number): Vec3[] {
	return simple_parametric(
		a.toString() + '*Math.cos(t)',
		b.toString() + '*t',
		a.toString() + '*Math.sin(t)',
		['t', 0, Math.PI * 2 * period, step]
	);
}

function knot(p: number, q: number, step: number) {
	const x = `(Math.cos(${q}*t)+2)*Math.cos(${p}*t)`;
	const z = `(Math.cos(${q}*t)+2)*Math.sin(${p}*t)`;
	const y = `-Math.sin(${q}*t)`;
	return simple_parametric(x, y, z, ['t', 0, Math.PI * 2, step]);
}

export { ellipse, knot, simple_equation, equation, parametric, simple_parametric, helix };

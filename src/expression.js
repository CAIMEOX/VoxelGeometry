/* eslint-disable @typescript-eslint/ban-types */
import { Vec3 } from "./vector.js";
function equation(expr, [xstart, xend, xstep], [ystart, yend, ystep], [zstart, zend, zstep]) {
    if (xstart > xend)
        [xstart, xend] = [xend, xstart];
    if (ystart > yend)
        [ystart, yend] = [yend, ystart];
    if (zstart > zend)
        [zstart, zend] = [zend, zstart];
    const result = [];
    const f = new Function("x", "y", "z", `return ${expr}`);
    for (let x = xstart; x <= xend; x += xstep)
        for (let y = ystart; y <= yend; y += ystep)
            for (let z = zstart; z <= zend; z += zstep)
                if (f(x, y, z))
                    result.push(new Vec3(x, y, z));
    return result;
}
function simple_equation(expr, start, end, step = 1) {
    return equation(expr, [start, end, step], [start, end, step], [start, end, step]);
}
function parametric(exprx, expry, exprz, ...vars) {
    const arg = vars.map((v) => v.name);
    const funs = vars.map((v) => new Function(v.varname, `return ${v.expr}`));
    const summoner = vars.map((v) => {
        const [start, end, step] = v.define;
        return new Array(Math.floor((end - start) / step))
            .fill(start)
            .map((v, i) => start + i * step);
    });
    const [costx, costy, costz] = [
        new Function(...arg, `return ${exprx}`),
        new Function(...arg, `return ${expry}`),
        new Function(...arg, `return ${exprz}`),
    ];
    return __boom(summoner).map((v) => {
        const values = funs.map((f, i) => f(v[i]));
        return new Vec3(costx(...values), costy(...values), costz(...values));
    });
}
//https://github.com/PureEval/PureEval/blob/main/src/iterate.js
function __boom(args) {
    // @ts-ignore
    let now = args.shift().map((x) => [x]), upper = [];
    args.forEach((v) => {
        v.forEach((u) => now.forEach((x) => upper.push([...x, u])));
        now = [...upper];
        upper = [];
    });
    return now;
}
function simple_parametric(exprx, expry, exprz, ...intervals) {
    const vars = intervals.map((v) => {
        return {
            name: v.shift(),
            varname: "p",
            expr: "p",
            define: [v[0], v[1], v[2]],
        };
    });
    return parametric(exprx, expry, exprz, ...vars);
}
function ellipse(a, b, step) {
    return simple_parametric(a.toString() + "*Math.cos(t)", "1", b.toString() + "*Math.sin(t)", ["t", 0, Math.PI * 2, step]);
}
function helix(a, b, period, step) {
    return simple_parametric(a.toString() + "*Math.cos(t)", b.toString() + "*t", a.toString() + "*Math.sin(t)", ["t", 0, Math.PI * 2 * period, step]);
}
function knot(p, q, step) {
    let x = `(Math.cos(${q}*t)+2)*Math.cos(${p}*t)`;
    let z = `(Math.cos(${q}*t)+2)*Math.sin(${p}*t)`;
    let y = `-Math.sin(${q}*t)`;
    return simple_parametric(x, y, z, ["t", 0, Math.PI * 2, step]);
}
export { ellipse, knot, simple_equation, equation, parametric, simple_parametric, helix, };

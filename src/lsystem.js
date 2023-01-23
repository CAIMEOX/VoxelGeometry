import { Turtle2D } from "./turtle.js";
export class LSystem {
    constructor(axioms, rules, symbols = []) {
        this.env = {};
        this.axiom = axioms;
        this.rules = rules;
        this.symbols = symbols;
    }
    generate(n) {
        let result = this.axiom;
        for (let i = 0; i < n; i++) {
            result = this.iterate(result);
        }
        this.axiom = result;
        return result;
    }
    iterate(str) {
        let result = "";
        for (let i = 0; i < str.length; i++) {
            const symbol = str[i];
            if (this.rules[symbol]) {
                result += this.rules[symbol];
            }
            else {
                result += symbol;
            }
        }
        return result;
    }
    setEnv(key, v) {
        this.env[key] = v;
    }
    runProc(proc = {}) {
        const t = new Turtle2D();
        const a = this.env["angle"];
        if (Object.keys(proc).length === 0) {
            proc = {
                F: () => t.forward(3),
                f: () => {
                    t.penUp();
                    t.forward(3);
                    t.penDown();
                },
                "+": () => t.rotate(a),
                "-": () => t.rotate(-a),
                "|": () => t.rotate(Math.PI),
                "[": () => t.push(),
                "]": () => t.pop(),
                "^": () => t.penUp(),
                v: () => t.penDown(),
            };
        }
        this.axiom.split("").forEach((c) => {
            if (proc[c]) {
                proc[c]();
            }
        });
        return t.getTrack();
    }
}
function lsystem(axiom, rules, generation = 1, angle = Math.PI / 2) {
    const lsys = new LSystem(axiom, rules);
    lsys.setEnv("angle", angle);
    lsys.generate(generation);
    return lsys.runProc();
}
function leaf(n) {
    return lsystem("a", {
        a: "F[+x]Fb",
        b: "F[-y]Fa",
        x: "a",
        y: "b",
    }, n, Math.PI / 4);
}
function triangle(n) {
    return lsystem("F+F+F", {
        F: "F-F+F",
    }, n, (Math.PI / 3) * 2);
}
function quadratic_gosper(n) {
    return lsystem("-YF", {
        X: "XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-",
        Y: "+FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY",
    }, n);
}
function square_sierpinski(n) {
    return lsystem("F+XF+F+XF", {
        X: "XF-F+F-XF+F+XF-F+F-X",
    }, n);
}
function crystal(n) {
    return lsystem("F+F+F+F", {
        F: "FF+F++F+F",
    }, n);
}
function peano_curve(n) {
    return lsystem("X", {
        X: "XFYFX+F+YFXFY-F-XFYFX",
        Y: "YFXFY-F-XFYFX+F+YFXFY",
    }, n);
}
function quadratic_snowflake_square(n) {
    return lsystem("FF+FF+FF+FF", {
        F: "F+F-F-F+F",
    }, n);
}
function rings(n) {
    return lsystem("F+F+F+F", {
        F: "FF+F+F+F+F+F-F",
    }, n);
}
export { lsystem, leaf, triangle, quadratic_gosper, square_sierpinski, crystal, peano_curve, quadratic_snowflake_square, rings, };

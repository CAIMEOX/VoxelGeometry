import { BlockLocation } from "mojang-minecraft";
import { Turtle2D } from "./turtle";

export class LSystem {
  axiom: string;
  rules: { [key: string]: string };
  env: { [key: string]: any } = {};
  symbols: string[];
  constructor(axioms: string, rules: { [key: string]: string }, symbols: string[] = []) {
    this.axiom = axioms;
    this.rules = rules;
    this.symbols = symbols;
  }

  generate(n: number): string {
    let result = this.axiom;
    for (let i = 0; i < n; i++) {
      result = this.iterate(result);
    }
    this.axiom = result;
    return result;
  }

  iterate(str: string): string {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      let symbol = str[i];
      if (this.rules[symbol]) {
        result += this.rules[symbol];
      } else {
        result += symbol;
      }
    }
    return result;
  }

  setEnv(key: string, v: any) {
    this.env[key] = v;
  }

  runProc(proc: { [key: string]: Function } = {}): BlockLocation[] {
    let t = new Turtle2D();
    let a: number = this.env["angle"];
    if (Object.keys(proc).length === 0) {
      proc = {
        F: () => t.forward(1),
        f: () => {
          t.penUp();
          t.forward(1);
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

function lsystem(
  axiom: string,
  rules: { [key: string]: string },
  generation = 1,
  angle = Math.PI / 2
): BlockLocation[] {
  let lsys = new LSystem(axiom, rules);
  lsys.setEnv("angle", angle);
  lsys.generate(generation);
  return lsys.runProc();
}

function leaf(n: number): BlockLocation[] {
  return lsystem(
    "a",
    {
      a: "F[+x]Fb",
      b: "F[-y]Fa",
      x: "a",
      y: "b",
    },
    n,
    Math.PI / 4
  );
}

function triangle(n: number): BlockLocation[] {
  return lsystem(
    "F+F+F",
    {
      F: "F-F+F",
    },
    n,
    (Math.PI / 3) * 2
  );
}

function QuadraticGosper(n: number): BlockLocation[] {
  return lsystem(
    "-YF",
    {
      X: "XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-",
      Y: "+FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY",
    },
    n
  );
}

function SquareSierpinski(n: number): BlockLocation[] {
  return lsystem(
    "F+XF+F+XF",
    {
      X: "XF-F+F-XF+F+XF-F+F-X",
    },
    n
  );
}

function Crystal(n: number): BlockLocation[] {
  return lsystem(
    "F+F+F+F",
    {
      F: "FF+F++F+F",
    },
    n
  );
}

function PeanoCurve(n: number): BlockLocation[] {
  return lsystem(
    "X",
    {
      X: "XFYFX+F+YFXFY-F-XFYFX",
      Y: "YFXFY-F-XFYFX+F+YFXFY",
    },
    n
  );
}

function QuadraticSnowflakeSquare(n: number): BlockLocation[] {
  return lsystem(
    "FF+FF+FF+FF",
    {
      F: "F+F-F-F+F",
    },
    n
  );
}

function Rings(n: number): BlockLocation[] {
  return lsystem(
    "F+F+F+F",
    {
      F: "FF+F+F+F+F+F-F",
    },
    n
  );
}

export {
  lsystem,
  leaf,
  triangle,
  QuadraticGosper,
  SquareSierpinski,
  Crystal,
  PeanoCurve,
  QuadraticSnowflakeSquare,
  Rings,
};

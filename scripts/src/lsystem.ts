import { BlockLocation } from "mojang-minecraft";
import { Turtle2D } from "./turtle";

export class LSystem {
  axiom: string;
  rules: { [key: string]: string };
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

  runProc(proc: { [key: string]: Function } = {}): BlockLocation[] {
    let t = new Turtle2D();
    let a = Math.PI / 2;
    if (proc == {}) {
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

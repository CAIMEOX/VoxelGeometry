import { BlockLocation } from "mojang-minecraft";
import { Turtle2D } from "./turtle";
import { LSystem } from "./lsystem";
// Universal configs : block, origin, player, dimension, env , facing , hollow?

function sphere(radius: number, inner_radius: number): BlockLocation[] {
  let result: BlockLocation[] = [];
  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      for (let z = -radius; z <= radius; z++) {
        if (x * x + y * y + z * z <= radius * radius && x * x + y * y + z * z >= inner_radius * inner_radius) {
          result.push(new BlockLocation(x, y, z));
        }
      }
    }
  }
  return result;
}

function circle(radius: number, inner_radius: number): BlockLocation[] {
  let result: BlockLocation[] = [];
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      if (x * x + z * z <= radius * radius && x * x + z * z >= inner_radius * inner_radius) {
        result.push(new BlockLocation(x, 0, z));
      }
    }
  }
  return result;
}

function torus(radius: number, ringRadius: number): BlockLocation[] {
  let result: BlockLocation[] = [];
  for (let x = -radius - ringRadius; x <= radius + ringRadius; x++) {
    for (let z = -radius - ringRadius; z <= radius + ringRadius; z++) {
      let xz_distance = Math.sqrt(x * x + z * z);
      if (xz_distance > 0) {
        let rx = (x / xz_distance) * ringRadius;
        let rz = (z / xz_distance) * ringRadius;
        let rd = Math.sqrt(x - rx) + Math.sqrt(z - rz);
        for (let y = -radius - ringRadius; y <= radius + ringRadius; y++) {
          if (rd + z * z <= radius * radius) {
            result.push(new BlockLocation(x, y, z));
          }
        }
      }
    }
  }
  return result;
}

// https://replit.com/@Michael_Nicol/Bresenhams-Algorithm#index.js
function line(p1: BlockLocation, p2: BlockLocation) {
  let dx = Math.abs(p2.x - p1.x);
  let dy = Math.abs(p2.y - p1.y);
  let dz = Math.abs(p2.z - p1.z);
  let xc = p2.x > p1.x ? 1 : -1;
  let yc = p2.y > p1.y ? 1 : -1;
  let zc = p2.z > p1.z ? 1 : -1;
  let result = [p1];
  let pk = [p1.x, p1.y, p1.z];
  if (dx >= dy && dx >= dz) {
    let pyk = 2 * dy - dx;
    let pzk = 2 * dz - dx;
    for (let k = 0; k < dx - 1; k++) {
      pk[0] += xc;
      pyk += 2 * dy;
      pzk += 2 * dz;
      if (pyk > 0 && pzk < 0) {
        pk[1] += yc;
        pyk -= 2 * dx;
      } else if (pyk === 0) {
        pk[2] += zc;
        pzk -= 2 * dx;
      } else {
        pk[1] += yc;
        pk[2] += zc;
        pyk -= 2 * dx;
        pzk -= 2 * dx;
      }
      result.push(new BlockLocation(pk[0], pk[1], pk[2]));
    }
  } else if (dy >= dx && dy >= dz) {
    console.log("dy drive");
    let pxk = 2 * dx - dy;
    let pzk = 2 * dz - dy;
    for (let k = 0; k < dy - 1; k++) {
      pk[1] += yc;
      pxk += 2 * dx;
      pzk += 2 * dz;
      if (pxk < 0 && pzk < 0) {
      }
      result.push(new BlockLocation(pk[0], pk[1], pk[2]));
    }
  } else if (dz >= dy && dz >= dx) {
    let pxk = 2 * dx - dz;
    let pyk = 2 * dy - dz;
    for (let k = 0; k < dz - 1; k++) {
      pk[2] += zc;
      pxk += 2 * dx;
      pyk += 2 * dy;
      if (pxk < 0 && pyk < 0) {
      }
      result.push(new BlockLocation(pk[0], pk[1], pk[2]));
    }
  }
  result.push(p2);
  return result;
}

function turtleTest(): BlockLocation[] {
  let t = new Turtle2D();
  for (let i = 0; i < 360; i++) {
    t.forward(1);
    // t.width(Math.round(i / 100) + 1);
    t.forward(i);
    t.rotate((30 * Math.PI) / 180);
  }
  return t.getTrack();
}

function fractalTest(n: number): BlockLocation[] {
  let lsys = new LSystem("-YF", {
    X: "XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-",
    Y: "+FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY",
  });
  let r = lsys.generate(n);
  return lsys.runProc();
}

function lsystem(axiom: string, rules: { [key: string]: string }, generation = 1): BlockLocation[] {
  let lsys = new LSystem(axiom, rules);
  lsys.generate(generation);
  return lsys.runProc();
}

function turtle(actions: string) {
  let lsys = new LSystem(actions, {});
  return lsys.runProc();
}

export { sphere, circle, line, torus, lsystem, turtle };

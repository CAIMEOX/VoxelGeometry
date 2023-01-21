import * as ws from "ws";
import readline from "readline";
import { stdin, stdout } from "process";
import * as Exp from "./expression.js";
import * as Generator from "./generator.js";
import * as Transform from "./transform.js";
import * as LSystem from "./lsystem.js";
import { DLA2D } from "./DLA2D.js";
import { DLA3D } from "./DLA3D.js";

class BlockLocation {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

function clifford_attractor(x, z, a, b, c, d) {
  let res = [];
  for (let t = 0; t < 100000; t++) {
    x = Math.sin(a * z) + c * Math.cos(a * x);
    z = Math.sin(b * x) + d * Math.cos(b * z);
    res.push(new BlockLocation(x, 0, z));
  }

  return res;
}

function peter_de_jong_attractors() {}

let wss = new ws.WebSocketServer({ port: 2333 });

function pack(bs) {
  return {
    op: "put",
    raw: bs.map((v) => put(v)),
  };
}

function put(b) {
  return [b.x, b.y, b.z];
}

wss.on("error", (e) => {
  console.log(e);
});

wss.on("connection", (socket) => {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  rl.on("line", (s) => {
    if (s === "clear") {
      socket.send(JSON.stringify({ op: "clear" }));
    } else if (s.split(" ")[0] == "camera") {
      let spl = s.split(" ");
      socket.send(JSON.stringify({ op: "camera", raw: [parseInt(spl[0]), parseInt(spl[1]), parseInt(spl[2])] }));
    } else {
      try {
        socket.send(JSON.stringify(pack(eval(s))));
      } catch (e) {
        console.error(e);
      }
    }
  });
});

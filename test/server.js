import * as ws from "ws";
import readline from "readline";
import { stdin, stdout } from "process";
import { sphere, circle, line, torus, turtle } from "./generator.js";
import {
  lsystem,
  leaf,
  triangle,
  quadratic_gosper,
  square_sierpinski,
  crystal,
  peano_curve,
  quadratic_snowflake_square,
  rings,
} from "./lsystem.js";
import { expression } from "./expression.js";
import { Turtle3D } from "./turtle.js";
import { scale, diffusion, rotate, swap, embed, move, pipe, array_gen, array_gen_fn } from "./transform.js";

class BlockLocation {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

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

wss.on("connection", (socket, req) => {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  rl.on("line", (s) => {
    if (s === "clear") {
      socket.send(JSON.stringify({ op: "clear" }));
    } else {
      try {
        socket.send(JSON.stringify(pack(eval(s))));
      } catch (e) {
        console.error(e);
      }
    }
  });
});

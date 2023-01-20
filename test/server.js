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
import {
  scale,
  diffusion,
  rotate,
  swap,
  embed,
  move,
  moveCenter,
  moveTo,
  center,
  pipe,
  array_gen,
  array_gen_fn,
} from "./transform.js";
import { DLA2D } from "./DLA2D.js";
import { DLA3D } from "./DLA3D.js";
import { Bitmap, Line, Point } from "./canvas.js";
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

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  ctx.closePath;
  ctx.stroke();
}

function test_canvas() {
  let bm = new Bitmap(200, 200);
  let ctx = bm.getContext();

  // ctx.drawLine(new Line(new Point(0, 0), new Point(100, 100)));
  // ctx.fillRect(1, 1, 10, 10);
  // ctx.strokeRect(1, 1, 10, 10);ctx.beginPath();
  roundedRect(ctx, 12, 12, 150, 150, 15);
  roundedRect(ctx, 19, 19, 150, 150, 9);
  roundedRect(ctx, 53, 53, 49, 33, 10);
  roundedRect(ctx, 53, 119, 49, 16, 6);
  roundedRect(ctx, 135, 53, 49, 33, 10);
  roundedRect(ctx, 135, 119, 25, 49, 10);

  ctx.beginPath();
  ctx.arc(37, 37, 13, Math.PI / 7, -Math.PI / 7, false);
  ctx.lineTo(31, 37);
  ctx.closePath();

  ctx.fill();

  for (var i = 0; i < 8; i++) {
    ctx.fillRect(51 + i * 16, 35, 4, 4);
  }

  for (i = 0; i < 6; i++) {
    ctx.fillRect(115, 51 + i * 16, 4, 4);
  }

  for (i = 0; i < 8; i++) {
    ctx.fillRect(51 + i * 16, 99, 4, 4);
  }

  ctx.beginPath();
  ctx.moveTo(83, 116);
  ctx.lineTo(83, 102);
  ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
  ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
  ctx.lineTo(111, 116);
  ctx.lineTo(106.333, 111.333);
  ctx.lineTo(101.666, 116);
  ctx.lineTo(97, 111.333);
  ctx.lineTo(92.333, 116);
  ctx.lineTo(87.666, 111.333);
  ctx.lineTo(83, 116);
  ctx.closePath();

  ctx.fill();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(91, 96);
  ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
  ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
  ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
  ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
  ctx.moveTo(103, 96);
  ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
  ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
  ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
  ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
  ctx.closePath();

  ctx.fill();

  ctx.beginPath();
  ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
  ctx.closePath();

  ctx.fill();

  ctx.beginPath();
  ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  return bm.getBlocks();
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

import * as ws from "ws";
import readline from "readline";
import { stdin, stdout } from "process";
import {
  Vec3,
  Exp,
  Generator,
  Transform,
  LSystem,
  IFS,
  DLA2D,
  DLA3D,
  Turtle2D,
  Turtle3D,
} from "@pureeval/voxel-geometry";

function hilbert(n) {
  let tt = new Turtle3D();
  let sys = new LSystem("X", { X: "^<XF^<XFX+F^>>XFX&F->>XFX+F>X+>" });
  sys.generate(n);
  let go = () => {
    tt.forward(3);
  };
  sys.runProc({
    F: go,
    "+": () => tt.yaw(90),
    "-": () => tt.yaw(-90),
    "^": () => tt.pitch(90),
    "&": () => tt.pitch(-90),
    ">": () => tt.roll(90),
    "<": () => tt.roll(-90),
  });
  return tt.getTrack();
}

function fancy_tree(depth, thickness, branchLen) {
  let t = new Turtle3D();
  function tree(depth, thickness, branchLen) {
    if (depth <= 0 || Math.random() < 0.2) {
      return;
    }
    // t.penwidth(thickness);
    t.forward(branchLen);
    let newThickness = thickness / 2 < 1 ? 1 : thickness / 2;
    let newBranchLen = branchLen * 0.75 < 1 ? 1 : branchLen * 0.75;
    for (let i = 0; i < 4; i++) {
      t.pitch(30);
      tree(depth - 1, newThickness, newBranchLen);
      t.pitch(-30);
      t.roll(90);
    }
    t.penUp();
    t.backward(branchLen);
    t.penDown();
  }

  tree(depth, thickness, branchLen);
  return t.getTrack();
}

function clifford_attractor(x, z, a, b, c, d) {
  let res = [];
  for (let t = 0; t < 100000; t++) {
    x = Math.sin(a * z) + c * Math.cos(a * x);
    z = Math.sin(b * x) + d * Math.cos(b * z);
    res.push(new Vec3(x, 0, z));
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

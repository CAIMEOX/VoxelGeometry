import * as ws from "ws";
import readline from "readline";
import { stdin, stdout } from "process";
import {
    Vec3,
    vec3,
    put,
    view,
    Exp,
    Generator,
    Transform,
    Lineamp,
    LSystem,
    IFS,
    DLA,
    Turtle2D,
    Turtle3D,
} from "@pureeval/voxel-geometry";

const wss = new ws.WebSocketServer({ port: 2333 });

function pack(bs) {
    console.log(bs);
    return {
        op: "put",
        raw: bs.map((v) => [v.x, v.y, v.z]),
    };
}

wss.on("error", (e) => {
    console.log(e);
});

wss.on("connection", (socket) => {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    rl.on("line", handleLine(socket));
});

function handleLine(socket) {
    return (s) => {
        try {
            if (s === "clear") sendClear(socket);
            else sendPack(socket, s);
        } catch (e) {
            console.log(e);
        }
    };
}

function sendClear(socket) {
    socket.send(JSON.stringify({ op: "clear" }));
}

function sendPack(socket, s) {
    socket.send(JSON.stringify(pack(eval(s))));
}

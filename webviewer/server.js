import { WebSocketServer } from 'ws';
import readline from 'readline';
import { stdin, stdout } from 'process';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import {
	Vec3,
	vec3,
	Exp,
	Generator,
	Transform,
	Lineamp,
	LSystem,
	IFS,
	DLA,
	Turtle2D,
	Turtle3D,
	Symmetry
} from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function pack(bs) {
	return {
		op: 'put',
		raw: bs.map((v) => [v.x, v.y, v.z])
	};
}

function handleWebSocket() {
	const wss = new WebSocketServer({ port: 2333 });

	wss.on('error', (e) => {
		console.log(e);
	});

	wss.on('connection', (socket) => {
		const rl = readline.createInterface({ input: stdin, output: stdout });
		rl.on('line', handleMessage(socket));
		socket.on('message', (str) => handleMessage(socket)(str.toString()));
		socket.on('close', () => rl.close());
	});

	function handleMessage(socket) {
		return (s) => {
			try {
				if (s === 'clear') sendClear(socket);
				else sendPack(socket, s);
			} catch (e) {
				console.log(e);
			}
		};
	}

	function sendClear(socket) {
		socket.send(JSON.stringify({ op: 'clear' }));
	}

	function sendPack(socket, s) {
		socket.send(JSON.stringify(pack(eval(s))));
	}
}

function handleHttpServer() {
	const app = express();

	app.use(express.static(join(__dirname, 'public')));
	app.use('/node_modules', express.static(join(resolve(__dirname, '../'), 'node_modules')));

	app.listen(8080, () => {
		console.log('Server is running. You can access it at http://localhost:8080.');
	});
}

handleWebSocket();
handleHttpServer();

import * as ws from 'ws';
import readline from 'readline';
import { stdin, stdout } from 'process';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, extname, resolve } from 'path';
import { readdirSync, renameSync, unlinkSync, mkdirSync, statSync, existsSync } from 'fs';
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
	Symmetry
} from './dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function pack(bs) {
	return {
		op: 'put',
		raw: bs.map((v) => [v.x, v.y, v.z])
	};
}

function rmdirSync(dirpath) {
	if (existsSync(dirpath) && statSync(dirpath).isDirectory()) {
		readdirSync(dirpath).forEach(function (file) {
			const curPath = join(dirpath, file);
			if (statSync(curPath).isDirectory()) {
				rmdirSync(curPath);
			} else {
				unlinkSync(curPath);
			}
		});
		rmdirSync(dirpath);
	}
}

function removeCache() {
	rmdirSync('./dist');
}

function moveScripts(sourceDir, targetDir, excludeDirs) {
	const entries = readdirSync(sourceDir, { withFileTypes: true });

	entries.forEach((entry) => {
		const sourcePath = join(sourceDir, entry.name);
		const targetPath = join(targetDir, entry.name);

		if (entry.isDirectory()) {
			if (!excludeDirs.includes(entry.name)) {
				moveScripts(sourcePath, targetPath, excludeDirs);
			}
		} else if (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts')) {
			if (!existsSync(targetDir)) {
				mkdirSync(targetDir, { recursive: true });
			}
			renameSync(sourcePath, targetPath);
		}
	});
}

function handleWebSocket() {
	const wss = new ws.WebSocketServer({ port: 2333 });

	wss.on('error', (e) => {
		console.log(e);
	});

	wss.on('connection', (socket) => {
		const rl = readline.createInterface({ input: stdin, output: stdout });
		rl.on('line', handleLine(socket));
	});

	function handleLine(socket) {
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

removeCache();
moveScripts(resolve(__dirname, '..'), resolve(__dirname, 'dist'), ['node_modules', 'webviewer']);
handleWebSocket();
handleHttpServer();

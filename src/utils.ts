function random(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

function rand(): number {
	const p = Math.random();
	if (p > 0.5) return Math.random();
	else return -Math.random();
}

export { rand, random };

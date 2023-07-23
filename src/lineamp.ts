import { Vec3, vec3 } from './vector.js';

class Matrix {
	matrix: number[][] = [];
	row: number;
	column: number;

	constructor(r: number, c: number, val = 0) {
		this.row = r;
		this.column = c;
		this.matrix = Array.from({ length: r }, () => Array(c).fill(val));
	}

	deepCopy(): Matrix {
		const result = new Matrix(this.row, this.column);
		result.matrix = this.matrix.map((row) => [...row]);
		return result;
	}

	getVector(row: number): Vec3 {
		return vec3(this.matrix[row][0], this.matrix[row][1], this.matrix[row][2]);
	}

	getVectorCol(col: number): Vec3 {
		return vec3(this.matrix[0][col], this.matrix[1][col], this.matrix[2][col]);
	}

	add(b: Matrix): Matrix {
		if (this.row != b.row || this.column != b.column) throw new Error('Matrix size error');
		const result = this.deepCopy();
		result.matrix = result.matrix.map((row, i) =>
			row.map((value, j) => value + b.matrix[i][j])
		);
		return result;
	}

	sub(b: Matrix): Matrix {
		if (this.row != b.row || this.column != b.column) throw new Error('Matrix size error');
		const result = this.deepCopy();
		result.matrix = result.matrix.map((row, i) =>
			row.map((value, j) => value - b.matrix[i][j])
		);
		return result;
	}

	scala(scalar: number): Matrix {
		const result = this.deepCopy();
		result.matrix = result.matrix.map((row) => row.map((value) => value * scalar));
		return result;
	}

	mul(b: Matrix): Matrix {
		if (this.column != b.row) throw new Error('Matrix size error');
		const result = new Matrix(this.row, b.column);
		for (let i = 0; i < this.row; ++i)
			for (let k = 0; k < this.column; ++k)
				for (let j = 0; j < b.column; ++j)
					result.matrix[i][j] += this.matrix[i][k] * b.matrix[k][j];
		return result;
	}

	pow(p: number): Matrix {
		let a = this.deepCopy(),
			result = unit(this.row);
		while (p) {
			if (p & 1) result = result.mul(a);
			p >>= 1;
			a = a.mul(a);
		}
		return result;
	}

	map(f: (v: number) => number): Matrix {
		const result = this.deepCopy();
		result.matrix = result.matrix.map((row) => row.map(f));
		return result;
	}

	negate(): Matrix {
		return this.map((v) => -v);
	}

	equal(b: Matrix): boolean {
		if (this.row != b.row || this.column != b.column) return false;
		return this.matrix.every((row, i) => row.every((value, j) => value === b.matrix[i][j]));
	}

	transpose(): Matrix {
		const result = new Matrix(this.column, this.row);
		result.matrix = this.matrix[0].map((_, i) => this.matrix.map((row) => row[i]));
		return result;
	}

	swapRow(a: number, b: number): Matrix {
		if (a > this.row || b > this.row) throw new Error('The row is too big');
		const result = this.deepCopy();
		[result.matrix[a], result.matrix[b]] = [result.matrix[b], result.matrix[a]];
		return result;
	}

	swapColumn(a: number, b: number): Matrix {
		if (a > this.column || b > this.column) throw new Error('The column is too big');
		const result = this.deepCopy();
		result.matrix.forEach((row) => {
			[row[a], row[b]] = [row[b], row[a]];
		});
		return result;
	}

	flipHorizontal(): Matrix {
		const result = this.deepCopy();
		result.matrix = result.matrix.reverse();
		return result;
	}

	flipVertical(): Matrix {
		const result = this.deepCopy();
		result.matrix.forEach((row) => row.reverse());
		return result;
	}

	flipMdiagonal(): Matrix {
		if (this.row != this.column) throw new Error('The row must be equal to the column');
		const result = this.deepCopy();
		result.matrix.forEach((row, i) => {
			row.forEach((_, j) => {
				if (j > i)
					[result.matrix[i][j], result.matrix[j][i]] = [
						result.matrix[j][i],
						result.matrix[i][j]
					];
			});
		});
		return result;
	}

	flipSdiagonal(): Matrix {
		if (this.row != this.column) throw new Error('The row must be equal to the column');
		const result = this.deepCopy();
		result.matrix.forEach((row, i) => {
			row.forEach((_, j) => {
				if (j < result.row - i) {
					const oppositeI = result.row - j;
					const oppositeJ = result.row - i;
					[result.matrix[i][j], result.matrix[oppositeI][oppositeJ]] = [
						result.matrix[oppositeI][oppositeJ],
						result.matrix[i][j]
					];
				}
			});
		});
		return result;
	}

	toString(): string {
		return this.matrix.map((row) => row.join(' ')).join('\n');
	}
}

function unit(n: number): Matrix {
	const result = new Matrix(n, n);
	for (let i = 0; i < n; ++i) result.matrix[i][i] = 1;
	return result;
}

function fromArray(A: Array<Array<number>>): Matrix {
	const temp = new Matrix(A.length, A[0].length);
	temp.matrix = A.map((row) => [...row]);
	return temp;
}

export { Matrix, unit, fromArray };

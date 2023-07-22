import { Vec3 } from './vector.js';

class Matrix {
	matrix: number[][] = [];
	row: number;
	column: number;

	constructor(r: number, c: number, val = 0) {
		(this.row = r), (this.column = c);
		for (let i = 0; i < r; ++i) {
			this.matrix[i] = new Array<number>();
			for (let j = 0; j < c; ++j) this.matrix[i][j] = val;
		}
	}

	deepCopy(): Matrix {
		const result = new Matrix(this.row, this.column);
		for (let i = 0; i < this.row; ++i)
			for (let j = 0; j < this.column; ++j) result.matrix[i][j] = this.matrix[i][j];
		return result;
	}

	getVector(row: number): Vec3 {
		return new Vec3(this.matrix[row][0], this.matrix[row][1], this.matrix[row][2]);
	}

	getVectorCol(col: number): Vec3 {
		return new Vec3(this.matrix[0][col], this.matrix[1][col], this.matrix[2][col]);
	}

	toString(): string {
		let result = '';
		for (let i = 0; i < this.row; ++i) {
			for (let j = 0; j < this.column; ++j) result += this.matrix[i][j].toString() + ' ';
			result += '\n';
		}
		return result;
	}
}

namespace trans {
	export function transpose(M: Matrix): Matrix {
		const result = new Matrix(M.column, M.row);
		for (let i = 0; i < M.row; ++i)
			for (let j = 0; j < M.column; ++j) result.matrix[j][i] = M.matrix[i][j];
		return result;
	}

	export function swapRow(M: Matrix, a: number, b: number): Matrix {
		if (a > M.row || b > M.row) throw new Error('The row is too big');
		const result = M.deepCopy();
		let c: number;
		for (let i = 0; i < result.column; ++i) {
			c = result.matrix[a][i];
			result.matrix[a][i] = result.matrix[b][i];
			result.matrix[b][i] = c;
		}
		return result;
	}

	export function swapColumn(M: Matrix, a: number, b: number): Matrix {
		if (a > M.column || b > M.column) throw new Error('The column is too big');
		const result = M.deepCopy();
		let c: number;
		for (let i = 0; i < result.row; ++i) {
			c = result.matrix[i][a];
			result.matrix[i][a] = result.matrix[i][b];
			result.matrix[i][b] = c;
		}
		return result;
	}

	export function flipHorizontal(M: Matrix): Matrix {
		let result = M.deepCopy();
		for (let i = 0; i < result.row / 2; ++i) result = swapRow(result, i, this.row - i + 1);
		return result;
	}

	export function flipVertica(M: Matrix): Matrix {
		let result = M.deepCopy();
		for (let i = 0; i < this.column / 2; ++i) result = swapColumn(result, i, this.column + 1);
		return result;
	}

	export function flipMdiagonal(M: Matrix): Matrix {
		if (M.row != M.column) throw new Error('The row must be equal to the column');
		const result = M.deepCopy();
		for (let i = 0; i < result.row; ++i)
			for (let j = i + 1; j < result.row; ++j) {
				const temp = result.matrix[i][j];
				result.matrix[i][j] = result.matrix[j][i];
				result.matrix[j][i] = temp;
			}
		return result;
	}

	export function flipSdiagonal(M: Matrix): Matrix {
		if (M.row != M.column) throw new Error('The row must be equal to the column');
		const result = M.deepCopy();
		for (let i = 0; i < result.row; ++i)
			for (let j = 0; j < result.row - i + 1; ++j) {
				const temp = result.matrix[i][j];
				result.matrix[i][j] = result.matrix[result.row - j + 1][result.row - i + 1];
				result.matrix[result.row - j + 1][result.row - i + 1] = temp;
			}
		return result;
	}
}

namespace cons {
	export function unit(n: number): Matrix {
		const result = new Matrix(n, n);
		for (let i = 0; i < n; ++i) result.matrix[i][i] = 1;
		return result;
	}

	export function fromArray(A: Array<Array<number>>): Matrix {
		const temp = new Matrix(A.length, A[0].length);
		temp.matrix = A;
		return temp;
	}
}

namespace oper {
	export function add(a: Matrix, b: Matrix): Matrix {
		if (a.row != b.row || a.column != b.column) throw new Error('Matrix size error');
		const result = new Matrix(a.row, a.column);
		for (let i = 0; i < a.row; ++i)
			for (let j = 0; j < a.column; ++j)
				result.matrix[i][j] = a.matrix[i][j] + b.matrix[i][j];
		return result;
	}

	export function sub(a: Matrix, b: Matrix): Matrix {
		if (a.row != b.row || a.column != b.column) throw new Error('Matrix size error');
		const result = new Matrix(a.row, a.column);
		for (let i = 0; i < a.row; ++i)
			for (let j = 0; j < a.column; ++j)
				result.matrix[i][j] = a.matrix[i][j] - b.matrix[i][j];
		return result;
	}

	export function mul(a: Matrix, b: Matrix): Matrix {
		if (a.column != b.row) throw new Error('Matrix size error');
		const result = new Matrix(a.row, b.column);
		for (let i = 0; i < a.row; ++i)
			for (let k = 0; k < a.column; ++k)
				for (let j = 0; j < b.column; ++j)
					result.matrix[i][j] += a.matrix[i][k] * b.matrix[k][j];
		return result;
	}

	export function pow(a: Matrix, p: number): Matrix {
		let result = cons.unit(a.row);
		while (p) {
			if (p & 1) result = mul(result, a);
			p >>= 1;
			a = mul(a, a);
		}
		return result;
	}

	export function map(M: Matrix, r: number, f: (v: number) => number): Matrix {
		const result = M.deepCopy();
		for (let i = 0; i < result.row; ++i)
			for (let j = 0; j < result.column; ++j) result.matrix[i][j] = f(result.matrix[i][j]);
		return result;
	}

	export function equal(a: Matrix, b: Matrix): boolean {
		if (a.row != b.row || a.column != b.column) return false;
		for (let i = 0; i < a.row; ++i)
			for (let j = 0; j < a.column; ++j) if (a.matrix[i][j] != b.matrix[i][j]) return false;
		return true;
	}
}

export { Matrix, oper, cons, trans };

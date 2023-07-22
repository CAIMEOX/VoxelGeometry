import { Vec3 } from './vector.js';

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
		return new Vec3(this.matrix[row][0], this.matrix[row][1], this.matrix[row][2]);
	}

	getVectorCol(col: number): Vec3 {
		return new Vec3(this.matrix[0][col], this.matrix[1][col], this.matrix[2][col]);
	}

	toString(): string {
		return this.matrix.map((row) => row.join(' ')).join('\n');
	}
}

namespace trans {
	export function transpose(M: Matrix): Matrix {
		const result = new Matrix(M.column, M.row);
		result.matrix = M.matrix[0].map((_, i) => M.matrix.map((row) => row[i]));
		return result;
	}

	export function swapRow(M: Matrix, a: number, b: number): Matrix {
		if (a > M.row || b > M.row) throw new Error('The row is too big');
		const result = M.deepCopy();
		[result.matrix[a], result.matrix[b]] = [result.matrix[b], result.matrix[a]];
		return result;
	}

	export function swapColumn(M: Matrix, a: number, b: number): Matrix {
		if (a > M.column || b > M.column) throw new Error('The column is too big');
		const result = M.deepCopy();
		result.matrix.forEach((row) => {
			[row[a], row[b]] = [row[b], row[a]];
		});
		return result;
	}

	export function flipHorizontal(M: Matrix): Matrix {
		const result = M.deepCopy();
		result.matrix = result.matrix.reverse();
		return result;
	}

	export function flipVertical(M: Matrix): Matrix {
		const result = M.deepCopy();
		result.matrix.forEach((row) => row.reverse());
		return result;
	}

	export function flipMdiagonal(M: Matrix): Matrix {
		if (M.row != M.column) throw new Error('The row must be equal to the column');
		const result = M.deepCopy();
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

	export function flipSdiagonal(M: Matrix): Matrix {
		if (M.row != M.column) throw new Error('The row must be equal to the column');
		const result = M.deepCopy();
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
}

namespace cons {
	export function unit(n: number): Matrix {
		const result = new Matrix(n, n);
		for (let i = 0; i < n; ++i) result.matrix[i][i] = 1;
		return result;
	}

	export function fromArray(A: Array<Array<number>>): Matrix {
		const temp = new Matrix(A.length, A[0].length);
		temp.matrix = A.map((row) => [...row]);
		return temp;
	}
}

namespace oper {
	export function add(a: Matrix, b: Matrix): Matrix {
		if (a.row != b.row || a.column != b.column) throw new Error('Matrix size error');
		const result = a.deepCopy();
		result.matrix = result.matrix.map((row, i) =>
			row.map((value, j) => value + b.matrix[i][j])
		);
		return result;
	}

	export function sub(a: Matrix, b: Matrix): Matrix {
		if (a.row != b.row || a.column != b.column) throw new Error('Matrix size error');
		const result = a.deepCopy();
		result.matrix = result.matrix.map((row, i) =>
			row.map((value, j) => value - b.matrix[i][j])
		);
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

	export function scala(a: Matrix, scalar: number): Matrix {
		const result = a.deepCopy();
		result.matrix = result.matrix.map((row) => row.map((value) => value * scalar));
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

	export function map(M: Matrix, f: (v: number) => number): Matrix {
		const result = M.deepCopy();
		result.matrix = result.matrix.map((row) => row.map(f));
		return result;
	}

	export function equal(a: Matrix, b: Matrix): boolean {
		if (a.row != b.row || a.column != b.column) return false;
		return a.matrix.every((row, i) => row.every((value, j) => value === b.matrix[i][j]));
	}
}

export { Matrix, oper, cons, trans };

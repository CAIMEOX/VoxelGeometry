import { BlockLocation } from "@minecraft/server";

class Matrix {
  matrix: Array<Array<number>> = new Array<Array<number>>();
  row: number;
  column: number;

  constructor(r: number, c: number, val = 0) {
    (this.row = r), (this.column = c);
    for (let i = 0; i < r; ++i) {
      this.matrix[i] = new Array<number>();
      for (let j = 0; j < c; ++j) this.matrix[i][j] = val;
    }
  }

  swap_row(a: number, b: number): void {
    if (a > this.row || b > this.row) throw new Error("The row is too big");
    let c: number;
    for (let i = 0; i < this.column; ++i) {
      c = this.matrix[a][i];
      this.matrix[a][i] = this.matrix[b][i];
      this.matrix[b][i] = c;
    }
  }

  swap_column(a: number, b: number): void {
    if (a > this.column || b > this.column) throw new Error("The column is too big");
    let c: number;
    for (let i = 0; i < this.row; ++i) {
      c = this.matrix[i][a];
      this.matrix[i][a] = this.matrix[i][b];
      this.matrix[i][b] = c;
    }
  }

  map(r: number, f: (v: number) => number) {
    for (let i = 0; i < this.column; ++i) this.matrix[r][i] = f(this.matrix[r][i]);
  }

  add(a: number, b: number, k: number): void {
    if (a > this.row || b > this.row) throw new Error("The row is too big");
    for (let i = 0; i < this.column; ++i) this.matrix[b][i] += this.matrix[a][i] * k;
  }

  fliphorizontal(): void {
    for (let i = 0; i < this.row / 2; ++i) this.swap_row(i, this.row - i + 1);
  }

  flipvertica(): void {
    for (let i = 0; i < this.column / 2; ++i) this.swap_column(i, this.column + 1);
  }

  flipmdiagonal(): void {
    if (this.row != this.column) throw new Error("The row must be equal to the column");
    for (let i = 0; i < this.row; ++i)
      for (let j = i + 1; j < this.row; ++j) {
        const temp = this.matrix[i][j];
        this.matrix[i][j] = this.matrix[j][i];
        this.matrix[j][i] = temp;
      }
  }

  flipsdiagonal(): void {
    if (this.row != this.column) throw new Error("The row must be equal to the column");
    for (let i = 0; i < this.row; ++i)
      for (let j = 0; j < this.row - i + 1; ++j) {
        const temp = this.matrix[i][j];
        this.matrix[i][j] = this.matrix[this.row - j + 1][this.row - i + 1];
        this.matrix[this.row - j + 1][this.row - i + 1] = temp;
      }
  }

  getVector(row: number): BlockLocation {
    return new BlockLocation(this.matrix[row][0], this.matrix[row][1], this.matrix[row][2]);
  }

  getVectorCol(col: number): BlockLocation {
    return new BlockLocation(this.matrix[0][col], this.matrix[1][col], this.matrix[2][col]);
  }

  toString(): string {
    let result = "";
    for (let i = 0; i < this.row; ++i) {
      for (let j = 0; j < this.column; ++j) result += this.matrix[i][j].toString() + " ";
      result += "\n";
    }
    return result;
  }
}
namespace construct {
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
namespace operation {
  export function add(a: Matrix, b: Matrix): Matrix {
    if (a.row != b.row || a.column != b.column) throw new Error("Matrix size error");
    const result = a;
    for (let i = 0; i < a.row; ++i) for (let j = 0; j < a.column; ++j) result.matrix[i][j] += b.matrix[i][j];
    return result;
  }

  export function sub(a: Matrix, b: Matrix): Matrix {
    if (a.row != b.row || a.column != b.column) throw new Error("Matrix size error");
    const result = a;
    for (let i = 0; i < a.row; ++i) for (let j = 0; j < a.column; ++j) result.matrix[i][j] -= b.matrix[i][j];
    return result;
  }

  export function mul(a: Matrix, b: Matrix): Matrix {
    if (a.column != b.row) throw new Error("Matrix size error");
    const result = new Matrix(a.row, b.column);
    for (let i = 0; i < a.row; ++i)
      for (let k = 0; k < a.column; ++k)
        for (let j = 0; j < b.column; ++j) result.matrix[i][j] += a.matrix[i][k] * b.matrix[k][j];
    return result;
  }

  export function pow(a: Matrix, p: number): Matrix {
    let result = construct.unit(a.row);
    while (p) {
      if (p & 1) result = mul(result, a);
      p >>= 1;
      a = mul(a, a);
    }
    return result;
  }

  export function equal(a: Matrix, b: Matrix): boolean {
    if (a.row != b.row || a.column != b.column) return false;
    for (let i = 0; i < a.row; ++i)
      for (let j = 0; j < a.column; ++j) if (a.matrix[i][j] != b.matrix[i][j]) return false;
    return true;
  }
}

export { Matrix, operation, construct };

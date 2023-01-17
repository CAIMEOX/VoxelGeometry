/*
 _     _                                  
| |   (_)_ __   ___  __ _ _ __ ___  _ __  
| |   | | '_ \ / _ \/ _` | '_ ` _ \| '_ \ 
| |___| | | | |  __/ (_| | | | | | | |_) |
|_____|_|_| |_|\___|\__,_|_| |_| |_| .__/ 
                                   |_|    
Lineamp v0.3 2022/1/17 By Lampese
*/
import { BlockLocation } from "@minecraft/server";
class Matrix {
  /** 矩阵实现，实际是一个二维数组 */
  matrix: Array<Array<number>> = new Array<Array<number>>();
  /**矩阵的行数 */
  row: number;
  /**矩阵的列数 */
  column: number;
  /**构造一个矩阵，r为行数，c为列数，val为矩阵的初值，默认为0。*/
  constructor(r: number, c: number, val: number = 0) {
    (this.row = r), (this.column = c);
    for (let i = 0; i < r; ++i) {
      this.matrix[i] = new Array<number>();
      for (let j = 0; j < c; ++j) this.matrix[i][j] = val;
    }
  }
  /**交换矩阵的a和b两行*/
  swap_row(a: number, b: number): void {
    if (a > this.row || b > this.row) throw new Error("The row is too big");
    let c: number;
    for (let i = 0; i < this.column; ++i) {
      c = this.matrix[a][i];
      this.matrix[a][i] = this.matrix[b][i];
      this.matrix[b][i] = c;
    }
  }
  /**交换矩阵中的a和b两列 */
  swap_column(a: number, b: number): void {
    if (a > this.column || b > this.column) throw new Error("The column is too big");
    let c: number;
    for (let i = 0; i < this.row; ++i) {
      c = this.matrix[i][a];
      this.matrix[i][a] = this.matrix[i][b];
      this.matrix[i][b] = c;
    }
  }
  /**对一整行元素进行映射*/
  map(r: number, f: (v: number) => number) {
    for (let i = 0; i < this.column; ++i) this.matrix[r][i] = f(this.matrix[r][i]);
  }
  /**将矩阵第a行所有元素乘以一个数字后加到第b行(第a行元素不发生改变)*/
  add(a: number, b: number, k: number): void {
    if (a > this.row || b > this.row) throw new Error("The row is too big");
    for (let i = 0; i < this.column; ++i) this.matrix[b][i] += this.matrix[a][i] * k;
  }
  /**对矩阵进行水平翻转 */
  fliphorizontal(): void {
    for (let i = 0; i < this.row / 2; ++i) this.swap_row(i, this.row - i + 1);
  }
  /**对矩阵进行垂直翻转 */
  flipvertica(): void {
    for (let i = 0; i < this.column / 2; ++i) this.swap_column(i, this.column + 1);
  }
  /**对矩阵进行主对角线翻转 */
  flipmdiagonal(): void {
    if (this.row != this.column) throw new Error("The row must be equal to the column");
    for (let i = 0; i < this.row; ++i)
      for (let j = i + 1; j < this.row; ++j) {
        let temp = this.matrix[i][j];
        this.matrix[i][j] = this.matrix[j][i];
        this.matrix[j][i] = temp;
      }
  }
  /**对矩阵进行次对角线翻转 */
  flipsdiagonal(): void {
    if (this.row != this.column) throw new Error("The row must be equal to the column");
    for (let i = 0; i < this.row; ++i)
      for (let j = 0; j < this.row - i + 1; ++j) {
        let temp = this.matrix[i][j];
        this.matrix[i][j] = this.matrix[this.row - j + 1][this.row - i + 1];
        this.matrix[this.row - j + 1][this.row - i + 1] = temp;
      }
  }
  /**获取单行的 BlockLocation 对象 */
  getVector(row: number): BlockLocation {
    return new BlockLocation(this.matrix[row][0], this.matrix[row][1], this.matrix[row][2]);
  }
  /**把矩阵变为可输出的字符串，可用于debug */
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
  //**构造一个n*n的单位矩阵 */
  export function unit(n: number): Matrix {
    let result = new Matrix(n, n);
    for (let i = 0; i < n; ++i) result.matrix[i][i] = 1;
    return result;
  }
  //**从二维数组构建矩阵 请保证下标从1开始 */
  export function fromArray(A: Array<Array<number>>): Matrix {
    let temp = new Matrix(A.length, A[0].length);
    temp.matrix = A;
    return temp;
  }
}
namespace operation {
  /**计算两个矩阵的和 */
  export function add(a: Matrix, b: Matrix): Matrix {
    if (a.row != b.row || a.column != b.column) throw new Error("Matrix size error");
    let result = a;
    for (let i = 0; i < a.row; ++i) for (let j = 0; j < a.column; ++j) result.matrix[i][j] += b.matrix[i][j];
    return result;
  }
  /**计算两个矩阵的差 */
  export function sub(a: Matrix, b: Matrix): Matrix {
    if (a.row != b.row || a.column != b.column) throw new Error("Matrix size error");
    let result = a;
    for (let i = 0; i < a.row; ++i) for (let j = 0; j < a.column; ++j) result.matrix[i][j] -= b.matrix[i][j];
    return result;
  }
  /**计算两个矩阵的乘积 */
  export function mul(a: Matrix, b: Matrix): Matrix {
    if (a.column != b.row) throw new Error("Matrix size error");
    let result = new Matrix(a.row, b.column);
    for (let i = 0; i < a.row; ++i)
      for (let k = 0; k < a.column; ++k)
        for (let j = 0; j < b.column; ++j) result.matrix[i][j] += a.matrix[i][k] * b.matrix[k][j];
    return result;
  }
  /**采用快速幂方法计算方形矩阵的幂a^p */
  export function pow(a: Matrix, p: number): Matrix {
    let result = construct.unit(a.row);
    while (p) {
      if (p & 1) result = mul(result, a);
      p >>= 1;
      a = mul(a, a);
    }
    return result;
  }
  /**比较两个矩阵是否相等 */
  export function equal(a: Matrix, b: Matrix): boolean {
    if (a.row != b.row || a.column != b.column) return false;
    for (let i = 0; i < a.row; ++i)
      for (let j = 0; j < a.column; ++j) if (a.matrix[i][j] != b.matrix[i][j]) return false;
    return true;
  }
}
export { Matrix, operation, construct };

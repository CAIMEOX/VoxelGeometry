import { Vec3 } from "./vector.js";
class Matrix {
    constructor(r, c, val = 0) {
        this.matrix = new Array();
        (this.row = r), (this.column = c);
        for (let i = 0; i < r; ++i) {
            this.matrix[i] = new Array();
            for (let j = 0; j < c; ++j)
                this.matrix[i][j] = val;
        }
    }
    swap_row(a, b) {
        if (a > this.row || b > this.row)
            throw new Error("The row is too big");
        let c;
        for (let i = 0; i < this.column; ++i) {
            c = this.matrix[a][i];
            this.matrix[a][i] = this.matrix[b][i];
            this.matrix[b][i] = c;
        }
    }
    swap_column(a, b) {
        if (a > this.column || b > this.column)
            throw new Error("The column is too big");
        let c;
        for (let i = 0; i < this.row; ++i) {
            c = this.matrix[i][a];
            this.matrix[i][a] = this.matrix[i][b];
            this.matrix[i][b] = c;
        }
    }
    map(r, f) {
        for (let i = 0; i < this.column; ++i)
            this.matrix[r][i] = f(this.matrix[r][i]);
    }
    add(a, b, k) {
        if (a > this.row || b > this.row)
            throw new Error("The row is too big");
        for (let i = 0; i < this.column; ++i)
            this.matrix[b][i] += this.matrix[a][i] * k;
    }
    fliphorizontal() {
        for (let i = 0; i < this.row / 2; ++i)
            this.swap_row(i, this.row - i + 1);
    }
    flipvertica() {
        for (let i = 0; i < this.column / 2; ++i)
            this.swap_column(i, this.column + 1);
    }
    flipmdiagonal() {
        if (this.row != this.column)
            throw new Error("The row must be equal to the column");
        for (let i = 0; i < this.row; ++i)
            for (let j = i + 1; j < this.row; ++j) {
                const temp = this.matrix[i][j];
                this.matrix[i][j] = this.matrix[j][i];
                this.matrix[j][i] = temp;
            }
    }
    flipsdiagonal() {
        if (this.row != this.column)
            throw new Error("The row must be equal to the column");
        for (let i = 0; i < this.row; ++i)
            for (let j = 0; j < this.row - i + 1; ++j) {
                const temp = this.matrix[i][j];
                this.matrix[i][j] = this.matrix[this.row - j + 1][this.row - i + 1];
                this.matrix[this.row - j + 1][this.row - i + 1] = temp;
            }
    }
    getVector(row) {
        return new Vec3(this.matrix[row][0], this.matrix[row][1], this.matrix[row][2]);
    }
    getVectorCol(col) {
        return new Vec3(this.matrix[0][col], this.matrix[1][col], this.matrix[2][col]);
    }
    toString() {
        let result = "";
        for (let i = 0; i < this.row; ++i) {
            for (let j = 0; j < this.column; ++j)
                result += this.matrix[i][j].toString() + " ";
            result += "\n";
        }
        return result;
    }
}
var construct;
(function (construct) {
    function unit(n) {
        const result = new Matrix(n, n);
        for (let i = 0; i < n; ++i)
            result.matrix[i][i] = 1;
        return result;
    }
    construct.unit = unit;
    function fromArray(A) {
        const temp = new Matrix(A.length, A[0].length);
        temp.matrix = A;
        return temp;
    }
    construct.fromArray = fromArray;
})(construct || (construct = {}));
var operation;
(function (operation) {
    function add(a, b) {
        if (a.row != b.row || a.column != b.column)
            throw new Error("Matrix size error");
        const result = a;
        for (let i = 0; i < a.row; ++i)
            for (let j = 0; j < a.column; ++j)
                result.matrix[i][j] += b.matrix[i][j];
        return result;
    }
    operation.add = add;
    function sub(a, b) {
        if (a.row != b.row || a.column != b.column)
            throw new Error("Matrix size error");
        const result = a;
        for (let i = 0; i < a.row; ++i)
            for (let j = 0; j < a.column; ++j)
                result.matrix[i][j] -= b.matrix[i][j];
        return result;
    }
    operation.sub = sub;
    function mul(a, b) {
        if (a.column != b.row)
            throw new Error("Matrix size error");
        const result = new Matrix(a.row, b.column);
        for (let i = 0; i < a.row; ++i)
            for (let k = 0; k < a.column; ++k)
                for (let j = 0; j < b.column; ++j)
                    result.matrix[i][j] += a.matrix[i][k] * b.matrix[k][j];
        return result;
    }
    operation.mul = mul;
    function pow(a, p) {
        let result = construct.unit(a.row);
        while (p) {
            if (p & 1)
                result = mul(result, a);
            p >>= 1;
            a = mul(a, a);
        }
        return result;
    }
    operation.pow = pow;
    function equal(a, b) {
        if (a.row != b.row || a.column != b.column)
            return false;
        for (let i = 0; i < a.row; ++i)
            for (let j = 0; j < a.column; ++j)
                if (a.matrix[i][j] != b.matrix[i][j])
                    return false;
        return true;
    }
    operation.equal = equal;
})(operation || (operation = {}));
export { Matrix, operation, construct };

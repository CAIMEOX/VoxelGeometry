"use strict";
exports.__esModule = true;
var server_1 = require("@minecraft/server");
function clifford_attractor(x, z, a, b, c, d) {
    var res = [];
    for (var t = 0; t < 10000; t++) {
        var x1 = Math.sin(a * z) + c * Math.cos(a * x);
        var z1 = Math.sin(b * x) + d * Math.cos(b * z);
        res.push(new server_1.BlockLocation(x1, 0, z1));
    }
    return res;
}
exports.clifford_attractor = clifford_attractor;

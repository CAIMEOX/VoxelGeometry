var LSystem = /** @class */ (function () {
  function LSystem(axioms, rules, symbols) {
    this.axiom = axioms;
    this.rules = rules;
    this.symbols = symbols;
  }
  LSystem.prototype.generate = function (n) {
    var result = this.axiom;
    for (var i = 0; i < n; i++) {
      result = this.iterate(result);
    }
    return result;
  };
  LSystem.prototype.iterate = function (str) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
      var symbol = str[i];
      if (this.rules[symbol]) {
        result += this.rules[symbol];
      } else {
        result += symbol;
      }
    }
    return result;
  };
  return LSystem;
})();

a = new LSystem(
  "F+F+F+F",
  {
    F: "FF+F-F+F+FF",
  },
  null
);
console.log(a.generate(4));

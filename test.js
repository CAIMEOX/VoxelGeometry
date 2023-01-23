(() => {
  var __defProp = Object.defineProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // build/scripts/src/system.js
  var import_server10 = __require("@minecraft/server");
  var import_server_ui = __require("@minecraft/server-ui");

  // build/scripts/src/pureeval/PureEval.js
  var PureEval_exports = {};
  __export(PureEval_exports, {
    Data: () => Data,
    Just: () => Just,
    L: () => list_exports,
    Lens: () => Lens,
    Maybe: () => Maybe,
    Nothing: () => Nothing,
    _: () => _,
    add: () => add,
    allCheck: () => allCheck,
    always: () => always,
    anyCheck: () => anyCheck,
    arr_equal: () => arr_equal,
    assoc: () => assoc,
    average: () => average,
    bind: () => bind,
    both: () => both,
    call: () => call,
    choose: () => choose,
    coalgebra: () => coalgebra,
    compose: () => compose,
    concat: () => concat,
    construct: () => construct,
    curry: () => curry,
    dec: () => dec,
    dissoc: () => dissoc,
    div: () => div,
    drop: () => drop,
    dropHead: () => dropHead,
    dropTail: () => dropTail,
    dropWhile: () => dropWhile,
    either: () => either,
    equal: () => equal,
    even: () => even,
    filter: () => filter,
    flatMap: () => flatMap,
    fold: () => fold,
    forEach: () => forEach,
    gt: () => gt,
    gte: () => gte,
    has: () => has,
    head: () => head,
    higherComp: () => higherComp,
    higherPipe: () => higherPipe,
    id: () => id,
    ifElse: () => ifElse,
    ifElse_v: () => ifElse_v,
    inc: () => inc,
    includes: () => includes,
    iterate: () => iterate,
    join: () => join,
    lt: () => lt,
    lte: () => lte,
    makePair: () => makePair,
    map: () => map,
    match: () => match,
    max: () => max,
    median: () => median,
    min: () => min,
    minus: () => minus,
    mod: () => mod,
    modify: () => modify,
    mul: () => mul,
    negate: () => negate,
    not: () => not,
    odd: () => odd,
    over: () => over,
    pipe: () => pipe,
    power: () => power,
    prod: () => prod,
    prop: () => prop,
    range: () => range,
    reduce: () => reduce,
    reject: () => reject,
    rema: () => rema,
    reverse: () => reverse,
    rexMatch: () => rexMatch,
    rexReplace: () => rexReplace,
    rexTest: () => rexTest,
    scan: () => scan,
    set: () => set,
    shied: () => shied,
    slice: () => slice,
    sort: () => sort,
    split: () => split,
    stateMachine: () => stateMachine,
    sum: () => sum,
    tail: () => tail,
    take: () => take,
    takeWhile: () => takeWhile,
    toLower: () => toLower,
    toString: () => toString,
    toUpper: () => toUpper,
    trim: () => trim,
    uncurry: () => uncurry,
    under: () => under,
    unless: () => unless,
    unless_v: () => unless_v,
    upper: () => upper,
    valuesIn: () => valuesIn,
    view: () => view,
    when: () => when,
    when_v: () => when_v,
    words: () => words,
    zip: () => zip,
    zipWith: () => zipWith
  });

  // build/scripts/src/pureeval/src/curry.js
  function curry(fun, ...argv) {
    if (fun.length === argv.length)
      return fun.call(null, ...argv);
    else {
      let result2 = curry.bind(null, ...arguments);
      result2.curryed = true;
      result2.len = fun.length - (arguments.length - 1);
      result2.origin = fun.bind(null, ...argv);
      return result2;
    }
  }
  function uncurry(fun) {
    return fun.origin;
  }

  // build/scripts/src/pureeval/src/filter.js
  var filter = curry((rule, arr) => {
    return arr.filter((v) => {
      return rule(v);
    });
  });
  var reject = curry((rule, arr) => {
    return arr.filter((v) => {
      return !rule(v);
    });
  });
  var shied = curry((v, arr) => {
    if (!Array.isArray(v))
      v = [v];
    return arr.filter((val) => {
      return !v.includes(val);
    });
  });
  var choose = curry((v, arr) => {
    if (!Array.isArray(v))
      v = [v];
    return arr.filter((val) => {
      return v.includes(val);
    });
  });

  // build/scripts/src/pureeval/src/iterate.js
  function __boom(args) {
    let now2 = args.shift().map((x) => [x]), upper2 = [];
    args.forEach((v) => {
      v.forEach((u) => now2.forEach((x) => upper2.push([...x, u])));
      now2 = [...upper2];
      upper2 = [];
    });
    return now2;
  }
  function iterate(fun, ...args) {
    let uncurryed = fun.curryed === true ? uncurry(fun) : fun;
    let iterateList = [], result2 = [];
    args.forEach((v) => iterateList.push(Array.isArray(v) ? v : [v]));
    __boom(iterateList).forEach((v) => result2.push(uncurryed.apply(null, v)));
    return result2;
  }
  var map = curry((rule, arr) => {
    return arr.map((v) => rule(v));
  });
  var flatMap = curry((rule, arr) => {
    return arr.flatMap(rule);
  });
  var forEach = curry((rule, arr) => {
    arr.forEach(rule);
  });
  var reduce = curry((fun, init, arr) => {
    return init != void 0 ? arr.reduce(fun, init) : arr.reduce(fun);
  });
  var fold = curry((fun, cnt, init) => {
    while (cnt--)
      init = fun(init);
    return init;
  });
  var scan = curry((init, fun, cnt) => {
    let result2 = [];
    while (cnt--)
      result2.push(init = fun(init));
    return result2;
  });

  // build/scripts/src/pureeval/src/math.js
  var odd = (v) => v % 2;
  var even = (v) => !(v % 2);
  var add = curry((a, b) => a + b);
  var minus = curry((a, b) => a - b);
  var mul = curry((a, b) => a * b);
  var div = curry((a, b) => a / b);
  var mod = curry((a, b) => a % b);
  var rema = curry((a, b) => (a % b + b) % b);
  var power = curry((a, b) => Math.pow(a, b));
  var negate = (a) => -a;
  var upper = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  var under = (a, b) => a > b ? -1 : a < b ? 1 : 0;
  var sort = curry((arr, rule) => {
    if (rule != void 0)
      return arr.sort(rule);
    else
      return arr.sort();
  });
  function median(arr) {
    let w = 2 - (arr.length & 1), x = arr.length - w >> 1;
    return average(Array.prototype.slice.call(arr, 0).sort((a, b) => a < b ? -1 : a > b ? 1 : 0).slice(x, x + w));
  }
  function sum(arr) {
    return arr.reduce((x, y) => x + y);
  }
  function prod(arr) {
    return arr.reduce((x, y) => x * y);
  }
  function max(arr) {
    return arr.reduce((x, y) => x > y ? x : y);
  }
  function min(arr) {
    return arr.reduce((x, y) => x < y ? x : y);
  }
  function average(arr) {
    return sum(arr) / arr.length;
  }
  function inc(x) {
    return x + 1;
  }
  function dec(x) {
    return x - 1;
  }

  // build/scripts/src/pureeval/src/range.js
  var range = curry((start, end) => {
    if (typeof start === "number" && typeof end === "number")
      return new Array(end - start + 1).fill(start).map((v, i) => start + i);
    else if (typeof start === "string" && typeof end === "string") {
      let l = start.charCodeAt(), r = end.charCodeAt();
      return new Array(r - l + 1).fill(start).map((v, i) => String.fromCharCode(l + i));
    }
  });

  // build/scripts/src/pureeval/src/summon.js
  function summon(total, fn) {
    let result;
    eval(`result=function(${Array(total).fill(0).map((v, i) => "a" + i).toString()}){return fn.apply(this,arguments)}`);
    return result;
  }
  function summonWithName(list, fn) {
    let result;
    eval(`result=function(${list.join(",")}){return fn(${list.join(",")})}`);
    return result;
  }

  // build/scripts/src/pureeval/src/transform.js
  function compose(...fun) {
    if (fun.length === 1)
      return fun[0];
    return summon(fun[fun.length - 1].length, fun.reduce((a, b) => (...args) => a(b(...args))));
  }
  function pipe(...fun) {
    if (fun.length == 1)
      return fun[0];
    let f = function() {
      let result2 = fun.shift().apply(this, arguments);
      return fun.reduce((p, c) => c(p), result2);
    };
    return summon(fun[0].length, f);
  }
  var call = curry((fun, args) => {
    return fun.apply(void 0, args);
  });

  // build/scripts/src/pureeval/src/bind.js
  var _ = { _P: 1 };
  function bind(func, ...args) {
    if (func.curryed === true)
      func = uncurry(func);
    let pos = [], nowarg = [], cnt = 0;
    args.forEach((v, i) => {
      if (v == _)
        ++cnt, pos.push(i);
      nowarg.push(v);
    });
    return summon(cnt, function() {
      let a = Object.values(arguments), arg = [...nowarg];
      pos.forEach((v) => arg[v] = a.shift());
      return func.apply(this, arg);
    });
  }

  // build/scripts/src/pureeval/src/logic.js
  var either = curry((a, b) => a || b);
  var both = curry((a, b) => a && b);
  var not = (v) => !v;
  var gt = curry((a, b) => a > b);
  var gte = curry((a, b) => a >= b);
  var lt = curry((a, b) => a < b);
  var lte = curry((a, b) => a <= b);
  var equal = curry((a, b) => a == b);
  var arr_equal = curry((a, b) => {
    return a.length === b.length ? true : reduce((p, c, i) => {
      if (p == false || c != b[i])
        return false;
      else
        return true;
    }, true)(a);
  });
  var id = (v) => v;
  var always = (v) => () => v;
  var when = curry((a, b) => {
    return function(obj) {
      if (a(obj))
        return b();
      return obj;
    };
  });
  var unless = curry((a, b) => {
    return function(obj) {
      if (!a(obj))
        return b();
      return obj;
    };
  });
  var ifElse = curry((a, b, c) => {
    return function(obj) {
      if (a(obj))
        return b();
      else
        return c();
    };
  });
  var when_v = curry((a, b) => {
    return function(obj) {
      if (a(obj))
        return b(obj);
      return obj;
    };
  });
  var unless_v = curry((a, b) => {
    return function(obj) {
      if (!a(obj))
        return b(obj);
      return obj;
    };
  });
  var ifElse_v = curry((a, b, c) => {
    return function(obj) {
      if (a(obj))
        return b(obj);
      else
        return c(obj);
    };
  });

  // build/scripts/src/pureeval/src/abstract/monad.js
  var Monad = class {
    constructor(v) {
      this.value = v;
    }
    static lift(v) {
      return new Monad(v);
    }
    map(f) {
      return this.lift(f(this.v));
    }
    chain(f) {
      return f(this.value);
    }
    apply(m) {
      return m.map(this.value);
    }
  };

  // build/scripts/src/pureeval/src/abstract/maybe.js
  var Maybe = class extends Monad {
    constructor(value) {
      super(value);
    }
    static lift(v) {
      return new Maybe(v);
    }
    static is(m) {
      return Object.prototype.toString.call(m) === "[object Object]" && m.constructor === Maybe;
    }
    isNothing() {
      return this.value === null || this.value === void 0;
    }
    map(f) {
      if (this.isNothing()) {
        return new Maybe(null);
      }
      return new Maybe(f(this.value));
    }
    chain(f) {
      if (this.isNothing()) {
        return new Maybe(null);
      }
      return f(this.value);
    }
    fold(asNothing, asJust) {
      return this.isNothing() ? asNothing(this.value) : asJust(this.value);
    }
  };
  var Nothing = Maybe.lift(null);
  var Just = (x) => Maybe.lift(x);

  // build/scripts/src/pureeval/src/list.js
  var zipWith = curry((f, a, b) => {
    let result2 = [], index = 0, end = Math.min(a.length, b.length);
    while (index < end) {
      result2.push(f(a[index], b[index]));
      ++index;
    }
    return result2;
  });
  var zip = zipWith((a, b) => [a, b]);
  var join = curry((s, arr) => arr.join(s));
  var slice = curry((start, end, arr) => arr.splice(start, end));
  var take = curry((pos, arr) => slice(0, pos - 1, arr));
  var takeWhile = curry((f, arr) => {
    let result2 = [], index = 0, end = arr.length;
    while (index < end) {
      if (f(arr[index]))
        result2.push(arr[index]);
      else
        break;
      ++index;
    }
    return result2;
  });
  var drop = curry((pos, arr) => arr.slice(pos));
  var dropWhile = curry((f, arr) => {
    let result2 = [], index = 0, end = arr.length, flag = false;
    while (index < end) {
      if (flag)
        result2.push(arr[index]);
      else if (!f(arr[index])) {
        flag = true;
        result2.push(arr[index]);
      }
      ++index;
    }
    return result2;
  });
  var allCheck = curry((f, arr) => {
    let index = 0, end = arr.length;
    while (index < end) {
      if (!f(arr[index]))
        return false;
      ++index;
    }
    return true;
  });
  var anyCheck = curry((f, arr) => {
    let index = 0, end = arr.length;
    while (index < end) {
      if (f(arr[index]))
        return true;
      ++index;
    }
    return false;
  });
  var concat = curry((a, b) => {
    if (Array.isArray(a))
      return a.concat(b);
    else
      return a + b;
  });
  var head = (arr) => arr[0];
  var tail = (arr) => arr[arr.length - 1];
  var dropHead = (arr) => drop(1, arr);
  var dropTail = (arr) => arr.splice(0, -1);
  var includes = curry((a, b) => a.includes(b));
  function reverse(arr) {
    let result2 = [], end = arr.length - 1;
    while (end >= 0) {
      result2.push(arr[end]);
      --end;
    }
    return result2;
  }

  // build/scripts/src/pureeval/src/match.js
  function match(...rules) {
    return function(value) {
      for (let i = 0; i < rules.length; i += 2) {
        if (typeof rules[i + 1] != "function")
          rules[i + 1] = always(rules[i + 1]);
        if (value == rules[i] || rules[i] == _) {
          if (Array.isArray(value) && value.length)
            return rules[i + 1](value, value[0], dropHead(value));
          else
            return rules[i + 1](value);
        } else if (Array.isArray(rules[i]) && Array.isArray(value) && arr_equal(value, rules[i])) {
          if (Array.isArray(value) && value.length)
            return rules[i + 1](value, value[0], dropHead(value));
          else
            return rules[i + 1](value);
        } else if (typeof rules[i] === "function" && rules[i](value))
          return rules[i + 1](value);
        else if (Maybe.is(rules[i]) && Maybe.is(value)) {
          if (rules[i].isNothing() && value.isNothing())
            return rules[i + 1](value);
          else if (rules[i].isNothing() || value.isNothing())
            continue;
          else if (rules[i].value === value.value)
            return rules[i + 1](value);
          else if (Array.isArray(rules[i].value) && Array.isArray(value.value) && arr_equal(rules[i].value, value.value))
            return rules[i + 1](value);
        }
      }
    };
  }

  // build/scripts/src/pureeval/src/abstract/data.js
  function Data(...args) {
    class DATA {
      constructor(type) {
        this.type = type;
      }
    }
    let data = { is: {}, from: (v) => v.constructor === DATA };
    for (let name in args) {
      let functions = args[name], fname;
      if (functions.includes(" ")) {
        let spl = functions.split(" ");
        fname = spl.shift();
        data[fname] = summonWithName(spl, (...iargs) => {
          let result2 = new DATA(fname);
          for (let idx in iargs)
            result2[spl[idx]] = iargs[idx];
          result2.args = iargs;
          return result2;
        });
      } else {
        fname = functions;
        data[fname] = new DATA(fname);
      }
      data.is[fname] = (val) => val.constructor === DATA && val.type === fname;
    }
    return data;
  }

  // build/scripts/src/pureeval/src/stateMachine.js
  var higherPipe = curry((functions, iv) => {
    let processed = [], processedIv = [], firstFunction, firstFunctionIv;
    iv.forEach((value, index) => {
      if (value !== 0) {
        processed.push(functions[index]);
        processedIv.push(value);
      }
    });
    firstFunction = processed.shift(), firstFunctionIv = processedIv.shift();
    if (processed.length === 0)
      return fold(firstFunction, firstFunctionIv);
    else
      return summon(firstFunction.length, (...args) => pipe.apply(void 0, processed.map((value, index) => fold(value, processedIv[index])))(firstFunction.len === 1 ? fold(firstFunction, firstFunctionIv, args[0]) : firstFunction(...args)));
  });
  var higherComp = curry((functions, iv) => {
    let processed = [], processedIv = [], firstFunction, firstFunctionIv;
    iv.forEach((value, index) => {
      if (value !== 0) {
        processed.push(functions[index]);
        processedIv.push(value);
      }
    });
    firstFunction = processed.pop(), firstFunctionIv = processedIv.pop();
    if (processed.length === 0)
      return fold(firstFunction, firstFunctionIv);
    else
      return summon(firstFunction.length, (...args) => compose.apply(void 0, processed.map((value, index) => fold(value, processedIv[index])))(firstFunction.len === 1 ? fold(firstFunction, firstFunctionIv, args[0]) : firstFunction(...args)));
  });
  var coalgebra = curry((seed, next) => () => seed = next(seed));
  var stateMachine = curry((seed, functions) => (iv) => seed = higherPipe(functions, iv)(seed));

  // build/scripts/src/pureeval/src/object.js
  function _assoc(pos, val, obj) {
    if (Array.isArray(obj)) {
      let arr = [].concat(obj);
      arr[pos] = val;
      return arr;
    }
    let result2 = {};
    for (let p in obj)
      result2[p] = obj[p];
    result2[pos] = val;
    return result2;
  }
  function _shallowCloneObject(pos, obj) {
    if (Number.isInteger(pos) && Array.isArray(obj))
      return [].concat(obj);
    let result2 = {};
    for (let p in obj)
      result2[p] = obj[p];
    return result2;
  }
  function _remove(start, cnt, list2) {
    let result2 = Array.prototype.slice.call(list2, 0);
    result2.splice(start, cnt);
    return result2;
  }
  function _dissoc(pos, obj) {
    if (Number.isInteger(pos) && Array.isArray(obj))
      return _remove(pos, 1, obj);
    let result2 = {};
    for (let p in obj)
      result2[p] = obj[p];
    delete result2[pos];
    return result2;
  }
  var prop = curry((s, a) => {
    if (Array.isArray(s)) {
      let value = a;
      for (let index in s)
        value = value[s[index]];
      return value;
    } else
      return a[s];
  });
  var assoc = curry((s, v, a) => {
    if (Array.isArray(s)) {
      let idx = s[0];
      if (s.length > 1) {
        let nextObj = !Just(a).isNothing() && Object.prototype.hasOwnProperty.call(a, idx) ? a[idx] : Number.isInteger(s[1]) ? [] : {};
        v = assoc(Array.prototype.slice.call(s, 1), v, nextObj);
      }
      return _assoc(idx, v, a);
    } else
      return _assoc(s, v, a);
  });
  var modify = curry((s, f, a) => {
    if (Array.isArray(s)) {
      let value = a;
      for (let index in s) {
        if (index == s.length - 1) {
          if (Just(value[s[index]]).isNothing())
            return Nothing;
          else
            value[s[index]] = f(value[s[index]]);
        }
        value = value[s[index]];
      }
    } else {
      if (Just(a[s]).isNothing())
        return Nothing;
      else
        a[s] = f(a[s]);
    }
    return a;
  });
  var dissoc = curry((s, a) => {
    if (Array.isArray(s)) {
      switch (s.length) {
        case 0:
          return a;
        case 1:
          return _dissoc(s[0], a);
        default:
          let head3 = s[0], tail3 = Array.prototype.slice.call(s, 1);
          if (a[head3] == null)
            return _shallowCloneObject(head3, a);
          else
            return assoc(head3, dissoc(tail3, a[head3]), a);
      }
    } else
      return _dissoc(s, a);
  });
  function valuesIn(x) {
    let result2 = [];
    for (let i in x)
      result2.push(x[i]);
    return x;
  }
  function makePair(arr) {
    let result2 = {};
    for (let i in arr)
      result2[arr[i][0]] = arr[i][1];
    return result2;
  }
  var construct = (cls) => curry(summon(cls.constructor.length, (...args) => new cls(...args)));
  var has = curry((prop2, obj) => Object.prototype.hasOwnProperty.call(obj, prop2));

  // build/scripts/src/pureeval/src/abstract/optics.js
  var Lens = class {
    constructor(getter, setter) {
      this.get = getter;
      this.set = setter;
    }
    static of(getter, setter) {
      return new Lens(getter, setter);
    }
    static bind(pos) {
      return new Lens(prop(pos), assoc(pos));
    }
  };
  var view = curry((lens, value) => lens.get(value));
  var set = curry((lens, opt, value) => lens.set(opt, value));
  var over = curry((lens, f, value) => lens.set(f(lens.get(value)), value));

  // build/scripts/src/pureeval/src/string.js
  var rexMatch = curry((rex, str) => str.match(rex));
  var rexReplace = curry((rex, to, str) => str.replace(rex, to));
  var rexTest = curry((rex, str) => str.test(rex));
  var toString = curry((val) => Just(val).isNothing() ? Nothing : val.toString());
  var split = curry((char, str) => str.split(char));
  var toLower = (v) => v.toLowerCase();
  var toUpper = (v) => v.toUpperCase();
  var trim = (v) => v.trim();
  var words = (str) => String(str).split(/\s|\b/).filter(function alpha(v) {
    return /^[\w]+$/.test(v);
  });

  // build/scripts/src/pureeval/src/abstract/list.js
  var list_exports = {};
  __export(list_exports, {
    choose: () => choose2,
    concat: () => concat2,
    drop: () => drop2,
    dropWhile: () => dropWhile2,
    faltMap: () => faltMap,
    filter: () => filter2,
    forEach: () => forEach2,
    head: () => head2,
    includes: () => includes,
    isEmpty: () => isEmpty,
    iterate: () => iterate2,
    lazy: () => lazy,
    map: () => map2,
    range: () => range2,
    reject: () => reject2,
    repeat: () => repeat,
    seq: () => seq,
    shied: () => shied2,
    tail: () => tail2,
    take: () => take2,
    takeWhile: () => takeWhile2,
    zip: () => zip2
  });
  var iter = (xs) => xs();
  var seq = (xs) => [...xs()];
  var head2 = (xs) => xs().next().value;
  var isEmpty = (xs) => xs().next().done === true;
  var range2 = curry((start, end, step) => function* () {
    do {
      yield start;
      start = step(start);
    } while (start != end);
    yield end;
  });
  var lazy = (xs) => function* () {
    for (let x of xs)
      yield x;
  };
  var tail2 = (xs) => function* () {
    let flag = false;
    for (let x of iter(xs)) {
      if (flag)
        yield x;
      else
        flag = true;
    }
  };
  var iterate2 = curry((f, d) => function* () {
    for (let x = d; ; x = f(x))
      yield x;
  });
  var map2 = curry((f, xs) => function* () {
    for (let x of iter(xs))
      yield f(x);
  });
  var faltMap = curry((f, xs) => function* () {
    for (let x of iter(xs))
      for (let y of iter(f(x)))
        yield y;
  });
  var concat2 = curry((xsa, xsb) => function* () {
    for (let x of iter(xsa))
      yield x;
    for (let x of iter(xsb))
      yield x;
  });
  var take2 = curry((n, xs) => function* () {
    for (let x of iter(xs)) {
      if (n > 0) {
        n--;
        yield x;
      } else
        return;
    }
  });
  var drop2 = curry((n, xs) => function* () {
    for (let x of iter(xs)) {
      if (n > 0) {
        n--;
      } else
        yield x;
    }
  });
  var repeat = (x) => function* () {
    while (1)
      yield x;
  };
  var filter2 = curry((rule, xs) => function* () {
    for (let x of iter(xs))
      if (rule(x))
        yield x;
  });
  var reject2 = curry((rule, xs) => function* () {
    for (let x of iter(xs))
      if (!rule(x))
        yield x;
  });
  var forEach2 = curry((rule, xs) => {
    for (let x of iter(xs))
      rule(x);
  });
  var takeWhile2 = curry((rule, xs) => function* () {
    for (let x of iter(xs)) {
      if (rule(x))
        yield x;
      break;
    }
  });
  var dropWhile2 = curry((rule, xs) => function* () {
    let flag = true;
    for (let x of iter(xs)) {
      if (rule(x) && flag === true)
        continue;
      else {
        flag = false;
        yield x;
      }
    }
  });
  var zipWith2 = curry((f, xa, xb) => function* () {
    let xsa = iter(xa), xsb = iter(xb);
    for (let x of xsa) {
      let iter_y = xsb.next();
      if (iter_y.done === true)
        break;
      yield f(x, iter_y.value);
    }
  });
  var zip2 = zipWith2((x, y) => [x, y]);
  var shied2 = curry((v, xs) => reject2(includes(v), xs));
  var choose2 = curry((v, xs) => filter2(includes(v), xs));

  // build/scripts/src/expression.js
  var expression_exports = {};
  __export(expression_exports, {
    ellipse: () => ellipse,
    equation: () => equation,
    helix: () => helix,
    knot: () => knot,
    parametric: () => parametric,
    simple_equation: () => simple_equation,
    simple_parametric: () => simple_parametric
  });
  var import_server = __require("@minecraft/server");
  function equation(expr, [xstart, xend, xstep], [ystart, yend, ystep], [zstart, zend, zstep]) {
    if (xstart > xend)
      [xstart, xend] = [xend, xstart];
    if (ystart > yend)
      [ystart, yend] = [yend, ystart];
    if (zstart > zend)
      [zstart, zend] = [zend, zstart];
    const result2 = [];
    const f = new Function("x", "y", "z", `return ${expr}`);
    for (let x = xstart; x <= xend; x += xstep)
      for (let y = ystart; y <= yend; y += ystep)
        for (let z = zstart; z <= zend; z += zstep)
          if (f(x, y, z))
            result2.push(new import_server.BlockLocation(x, y, z));
    return result2;
  }
  function simple_equation(expr, start, end, step = 1) {
    return equation(expr, [start, end, step], [start, end, step], [start, end, step]);
  }
  function parametric(exprx, expry, exprz, ...vars) {
    const arg = vars.map((v) => v.name);
    const funs = vars.map((v) => new Function(v.varname, `return ${v.expr}`));
    const summoner = vars.map((v) => {
      const [start, end, step] = v.define;
      return new Array(Math.floor((end - start) / step)).fill(start).map((v2, i) => start + i * step);
    });
    const [costx, costy, costz] = [
      new Function(...arg, `return ${exprx}`),
      new Function(...arg, `return ${expry}`),
      new Function(...arg, `return ${exprz}`)
    ];
    return __boom2(summoner).map((v) => {
      const values = funs.map((f, i) => f(v[i]));
      return new import_server.BlockLocation(costx(...values), costy(...values), costz(...values));
    });
  }
  function __boom2(args) {
    let now2 = args.shift().map((x) => [x]), upper2 = [];
    args.forEach((v) => {
      v.forEach((u) => now2.forEach((x) => upper2.push([...x, u])));
      now2 = [...upper2];
      upper2 = [];
    });
    return now2;
  }
  function simple_parametric(exprx, expry, exprz, ...intervals) {
    const vars = intervals.map((v) => {
      return {
        name: v.shift(),
        varname: "p",
        expr: "p",
        define: [v[0], v[1], v[2]]
      };
    });
    return parametric(exprx, expry, exprz, ...vars);
  }
  function ellipse(a, b, step) {
    return simple_parametric(a.toString() + "*Math.cos(t)", "1", b.toString() + "*Math.sin(t)", [
      "t",
      0,
      Math.PI * 2,
      step
    ]);
  }
  function helix(a, b, period, step) {
    return simple_parametric(a.toString() + "*Math.cos(t)", b.toString() + "*t", a.toString() + "*Math.sin(t)", [
      "t",
      0,
      Math.PI * 2 * period,
      step
    ]);
  }
  function knot(p, q, step) {
    let x = `(Math.cos(${q}*t)+2)*Math.cos(${p}*t)`;
    let z = `(Math.cos(${q}*t)+2)*Math.sin(${p}*t)`;
    let y = `-Math.sin(${q}*t)`;
    return simple_parametric(x, y, z, ["t", 0, Math.PI * 2, step]);
  }

  // build/scripts/src/generator.js
  var generator_exports = {};
  __export(generator_exports, {
    circle: () => circle,
    line: () => line,
    sphere: () => sphere,
    torus: () => torus,
    turtle: () => turtle
  });
  var import_server5 = __require("@minecraft/server");

  // build/scripts/src/lsystem.js
  var lsystem_exports = {};
  __export(lsystem_exports, {
    LSystem: () => LSystem,
    crystal: () => crystal,
    leaf: () => leaf,
    lsystem: () => lsystem,
    peano_curve: () => peano_curve,
    quadratic_gosper: () => quadratic_gosper,
    quadratic_snowflake_square: () => quadratic_snowflake_square,
    rings: () => rings,
    square_sierpinski: () => square_sierpinski,
    triangle: () => triangle
  });

  // build/scripts/src/turtle.js
  var import_server4 = __require("@minecraft/server");

  // build/scripts/src/lineamp.js
  var import_server2 = __require("@minecraft/server");
  var Matrix = class {
    constructor(r, c, val = 0) {
      this.matrix = new Array();
      this.row = r, this.column = c;
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
      return new import_server2.BlockLocation(this.matrix[row][0], this.matrix[row][1], this.matrix[row][2]);
    }
    getVectorCol(col) {
      return new import_server2.BlockLocation(this.matrix[0][col], this.matrix[1][col], this.matrix[2][col]);
    }
    toString() {
      let result2 = "";
      for (let i = 0; i < this.row; ++i) {
        for (let j = 0; j < this.column; ++j)
          result2 += this.matrix[i][j].toString() + " ";
        result2 += "\n";
      }
      return result2;
    }
  };
  var construct2;
  (function(construct3) {
    function unit(n) {
      const result2 = new Matrix(n, n);
      for (let i = 0; i < n; ++i)
        result2.matrix[i][i] = 1;
      return result2;
    }
    construct3.unit = unit;
    function fromArray(A) {
      const temp = new Matrix(A.length, A[0].length);
      temp.matrix = A;
      return temp;
    }
    construct3.fromArray = fromArray;
  })(construct2 || (construct2 = {}));
  var operation;
  (function(operation2) {
    function add2(a, b) {
      if (a.row != b.row || a.column != b.column)
        throw new Error("Matrix size error");
      const result2 = a;
      for (let i = 0; i < a.row; ++i)
        for (let j = 0; j < a.column; ++j)
          result2.matrix[i][j] += b.matrix[i][j];
      return result2;
    }
    operation2.add = add2;
    function sub(a, b) {
      if (a.row != b.row || a.column != b.column)
        throw new Error("Matrix size error");
      const result2 = a;
      for (let i = 0; i < a.row; ++i)
        for (let j = 0; j < a.column; ++j)
          result2.matrix[i][j] -= b.matrix[i][j];
      return result2;
    }
    operation2.sub = sub;
    function mul2(a, b) {
      if (a.column != b.row)
        throw new Error("Matrix size error");
      const result2 = new Matrix(a.row, b.column);
      for (let i = 0; i < a.row; ++i)
        for (let k = 0; k < a.column; ++k)
          for (let j = 0; j < b.column; ++j)
            result2.matrix[i][j] += a.matrix[i][k] * b.matrix[k][j];
      return result2;
    }
    operation2.mul = mul2;
    function pow(a, p) {
      let result2 = construct2.unit(a.row);
      while (p) {
        if (p & 1)
          result2 = mul2(result2, a);
        p >>= 1;
        a = mul2(a, a);
      }
      return result2;
    }
    operation2.pow = pow;
    function equal2(a, b) {
      if (a.row != b.row || a.column != b.column)
        return false;
      for (let i = 0; i < a.row; ++i)
        for (let j = 0; j < a.column; ++j)
          if (a.matrix[i][j] != b.matrix[i][j])
            return false;
      return true;
    }
    operation2.equal = equal2;
  })(operation || (operation = {}));

  // build/scripts/src/transform.js
  var transform_exports = {};
  __export(transform_exports, {
    array_gen: () => array_gen,
    array_gen_fn: () => array_gen_fn,
    center: () => center,
    diffusion: () => diffusion,
    embed: () => embed,
    fmap: () => fmap,
    move: () => move,
    moveCenter: () => moveCenter,
    moveTo: () => moveTo,
    pipe: () => pipe2,
    put: () => put,
    reduce_pos: () => reduce_pos,
    rotate: () => rotate,
    round_pos: () => round_pos,
    scale: () => scale,
    swap: () => swap
  });
  var import_server3 = __require("@minecraft/server");
  function embed(base, target) {
    const xT = /* @__PURE__ */ new Map();
    base.forEach((v) => {
      if (!xT.has(v.x))
        xT.set(v.x, /* @__PURE__ */ new Map());
      xT.get(v.x)?.set(v.z);
    });
    return target.filter((v) => xT.has(v.x) && xT.get(v.x)?.has(v.z));
  }
  function swap(v, d1, d2) {
    return v.map((b) => {
      const k = view2(b);
      [k[d1], k[d2]] = [k[d2], k[d1]];
      return put(k);
    });
  }
  function view2(v) {
    return [v.x, v.y, v.z];
  }
  function put(k) {
    return new import_server3.BlockLocation(k[0], k[1], k[2]);
  }
  function blockFromFloat(x, y, z) {
    return new import_server3.BlockLocation(Math.round(x), Math.round(y), Math.round(z));
  }
  function scale(v, size) {
    return v.flatMap((b) => move(duplicate(size), b.x * size - 1, b.y * size - 1, b.z * size - 1));
  }
  function diffusion(v, factor) {
    return v.map((b) => new import_server3.BlockLocation(b.x * factor, b.y * factor, b.z * factor));
  }
  function P(x, y, z) {
    return new import_server3.BlockLocation(x, y, z);
  }
  function duplicate(n) {
    const r = [];
    for (let x = -n; x < n; ++x) {
      for (let y = -n; y < n; ++y) {
        for (let z = -n; z < n; ++z) {
          r.push(new import_server3.BlockLocation(x, y, z));
        }
      }
    }
    return r;
  }
  function center(b) {
    let [xmin, xmax, ymin, ymax, zmin, zmax] = [
      1e9,
      -1e9,
      1e9,
      -1e9,
      1e9,
      -1e9
    ];
    b.forEach((v) => {
      xmin = Math.min(xmin, v.x);
      xmax = Math.max(xmax, v.x);
      ymin = Math.min(ymin, v.y);
      ymax = Math.max(ymax, v.y);
      zmin = Math.min(zmin, v.z);
      zmax = Math.max(zmax, v.z);
    });
    return blockFromFloat((xmin + xmax) / 2, (ymin + ymax) / 2, (zmin + zmax) / 2);
  }
  function move(b, x = 0, y = 0, z = 0) {
    return b.map((k) => new import_server3.BlockLocation(x + k.x, y + k.y, z + k.z));
  }
  function moveTo(b, from, to) {
    return move(b, to.x - from.x, to.y - from.y, to.z - from.z);
  }
  function moveCenter(b) {
    return moveTo(b, center(b), P(0, 0, 0));
  }
  function array_gen(xn, yn, zn, dx = 1, dy = 1, dz = 1) {
    const r = [];
    for (let x = 1; x < xn; ++x) {
      for (let y = 1; y < yn; ++y) {
        for (let z = 1; z < zn; ++z) {
          r.push(new import_server3.BlockLocation(x * dx, y * dy, z * dz));
        }
      }
    }
    return r;
  }
  function array_gen_fn(xn, yn, zn, dx, dy, dz) {
    const r = [];
    for (let x = 1; x < xn; ++x) {
      for (let y = 1; y < yn; ++y) {
        for (let z = 1; z < zn; ++z) {
          r.push(new import_server3.BlockLocation(dx(x), dy(y), dz(z)));
        }
      }
    }
    return r;
  }
  function rotate(v, angle) {
    const R_y = construct2.fromArray([
      [Math.cos(angle), 0, Math.sin(angle)],
      [0, 1, 0],
      [-Math.sin(angle), 0, Math.cos(angle)]
    ]);
    return v.map((b) => {
      const m = construct2.fromArray([[b.x], [b.y], [b.z]]);
      const r = operation.mul(R_y, m).getVector(0);
      return r;
    });
  }
  function pipe2(...mat) {
    let r = mat.shift() ?? [];
    mat.forEach((next) => {
      let res = [];
      r.forEach((k) => {
        res = res.concat(move(next, k.x, k.y, k.z));
      });
      r = res;
    });
    return r;
  }
  function reduce_pos(v) {
    return embed(v, v);
  }
  function round_pos(v) {
    return v.map(fmap(Math.round));
  }
  var fmap = (f) => (v) => {
    return new import_server3.BlockLocation(f(v.x), f(v.y), f(v.z));
  };

  // build/scripts/src/turtle.js
  var Turtle2D = class {
    constructor() {
      this.pen = true;
      this.x = 0;
      this.y = 0;
      this.angle = 0;
      this.thickness = 1;
      this.track = [];
      this.stack = [];
    }
    penUp() {
      this.pen = false;
    }
    penDown() {
      this.pen = true;
    }
    left() {
      this.angle += Math.PI / 2;
    }
    right() {
      this.angle -= Math.PI / 2;
    }
    rotate(angle) {
      this.angle += angle;
    }
    push() {
      this.stack.push({
        x: this.x,
        y: this.y,
        angle: this.angle,
        pen: this.pen,
        thickness: this.thickness
      });
    }
    pop() {
      const state = this.stack.pop();
      if (state) {
        this.x = state.x;
        this.y = state.y;
        this.angle = state.angle;
        this.pen = state.pen;
        this.thickness = state.thickness;
      }
    }
    goto(x, y) {
      if (this.pen) {
        this.track.push(new import_server4.BlockLocation(this.x, 0, this.y));
      }
      this.x = x;
      this.y = y;
    }
    width(width) {
      this.thickness = width;
    }
    dot(x, y) {
      if (this.pen) {
        if (this.thickness === 1) {
          this.track.push(new import_server4.BlockLocation(x, 0, y));
        } else {
          const r = this.thickness / 2;
          for (let i = -r; i <= r; i++) {
            for (let j = -r; j <= r; j++) {
              for (let k = -r; k <= r; k++) {
                this.track.push(new import_server4.BlockLocation(x + i, k, y + j));
              }
            }
          }
        }
      }
    }
    line(x1, y1) {
      let x0 = this.x;
      let y0 = this.y;
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;
      for (; ; ) {
        this.dot(x0, y0);
        if (x0 === x1 && y0 === y1)
          break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
      }
    }
    forward(distance3) {
      const x = this.x + Math.round(distance3 * Math.cos(this.angle));
      const y = this.y + Math.round(distance3 * Math.sin(this.angle));
      this.line(x, y);
      this.x = x;
      this.y = y;
    }
    backward(distance3) {
      this.forward(-distance3);
    }
    getTrack() {
      return this.track;
    }
  };
  var TO_DEGRESS = 180 / Math.PI;
  var TO_RADIANS = Math.PI / 180;

  // build/scripts/src/lsystem.js
  var LSystem = class {
    constructor(axioms, rules, symbols = []) {
      this.env = {};
      this.axiom = axioms;
      this.rules = rules;
      this.symbols = symbols;
    }
    generate(n) {
      let result2 = this.axiom;
      for (let i = 0; i < n; i++) {
        result2 = this.iterate(result2);
      }
      this.axiom = result2;
      return result2;
    }
    iterate(str) {
      let result2 = "";
      for (let i = 0; i < str.length; i++) {
        const symbol = str[i];
        if (this.rules[symbol]) {
          result2 += this.rules[symbol];
        } else {
          result2 += symbol;
        }
      }
      return result2;
    }
    setEnv(key, v) {
      this.env[key] = v;
    }
    runProc(proc = {}) {
      const t = new Turtle2D();
      const a = this.env["angle"];
      if (Object.keys(proc).length === 0) {
        proc = {
          F: () => t.forward(3),
          f: () => {
            t.penUp();
            t.forward(3);
            t.penDown();
          },
          "+": () => t.rotate(a),
          "-": () => t.rotate(-a),
          "|": () => t.rotate(Math.PI),
          "[": () => t.push(),
          "]": () => t.pop(),
          "^": () => t.penUp(),
          v: () => t.penDown()
        };
      }
      this.axiom.split("").forEach((c) => {
        if (proc[c]) {
          proc[c]();
        }
      });
      return t.getTrack();
    }
  };
  function lsystem(axiom, rules, generation = 1, angle = Math.PI / 2) {
    const lsys = new LSystem(axiom, rules);
    lsys.setEnv("angle", angle);
    lsys.generate(generation);
    return lsys.runProc();
  }
  function leaf(n) {
    return lsystem("a", {
      a: "F[+x]Fb",
      b: "F[-y]Fa",
      x: "a",
      y: "b"
    }, n, Math.PI / 4);
  }
  function triangle(n) {
    return lsystem("F+F+F", {
      F: "F-F+F"
    }, n, Math.PI / 3 * 2);
  }
  function quadratic_gosper(n) {
    return lsystem("-YF", {
      X: "XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-",
      Y: "+FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY"
    }, n);
  }
  function square_sierpinski(n) {
    return lsystem("F+XF+F+XF", {
      X: "XF-F+F-XF+F+XF-F+F-X"
    }, n);
  }
  function crystal(n) {
    return lsystem("F+F+F+F", {
      F: "FF+F++F+F"
    }, n);
  }
  function peano_curve(n) {
    return lsystem("X", {
      X: "XFYFX+F+YFXFY-F-XFYFX",
      Y: "YFXFY-F-XFYFX+F+YFXFY"
    }, n);
  }
  function quadratic_snowflake_square(n) {
    return lsystem("FF+FF+FF+FF", {
      F: "F+F-F-F+F"
    }, n);
  }
  function rings(n) {
    return lsystem("F+F+F+F", {
      F: "FF+F+F+F+F+F-F"
    }, n);
  }

  // build/scripts/src/generator.js
  function sphere(radius, inner_radius) {
    const result2 = [];
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        for (let z = -radius; z <= radius; z++) {
          if (x * x + y * y + z * z <= radius * radius && x * x + y * y + z * z >= inner_radius * inner_radius) {
            result2.push(new import_server5.BlockLocation(x, y, z));
          }
        }
      }
    }
    return result2;
  }
  function circle(radius, inner_radius) {
    const result2 = [];
    for (let x = -radius; x <= radius; x++) {
      for (let z = -radius; z <= radius; z++) {
        if (x * x + z * z <= radius * radius && x * x + z * z >= inner_radius * inner_radius) {
          result2.push(new import_server5.BlockLocation(x, 0, z));
        }
      }
    }
    return result2;
  }
  function torus(radius, ringRadius) {
    const result2 = [];
    for (let x = -radius - ringRadius; x <= radius + ringRadius; x++) {
      for (let z = -radius - ringRadius; z <= radius + ringRadius; z++) {
        const xz_distance = Math.sqrt(x * x + z * z);
        if (xz_distance > 0) {
          const rx = x / xz_distance * ringRadius;
          const rz = z / xz_distance * ringRadius;
          const rd = Math.sqrt(x - rx) + Math.sqrt(z - rz);
          for (let y = -radius - ringRadius; y <= radius + ringRadius; y++) {
            if (rd + z * z <= radius * radius) {
              result2.push(new import_server5.BlockLocation(x, y, z));
            }
          }
        }
      }
    }
    return result2;
  }
  var line = (p1, p2) => {
    const [x1, y1, z1] = [p1.x, p1.y, p1.z];
    const [x2, y2, z2] = [p2.x, p2.y, p2.z];
    let dy = y2 - y1;
    let dx = x2 - x1;
    let dz = z2 - z1;
    const qChange = [dx < 0 ? -1 : 1, dy < 0 ? -1 : 1, dz < 0 ? -1 : 1];
    dx = Math.abs(dx);
    dy = Math.abs(dy);
    dz = Math.abs(dz);
    let largestChange;
    if (dy >= dz && dy >= dx) {
      largestChange = 1;
    } else if (dx >= dy && dx >= dz) {
      largestChange = 0;
    } else {
      largestChange = 2;
    }
    const largestTarget = Math.max(dy, dx, dz);
    const startAxis = largestChange === 1 ? y1 : largestChange === 0 ? x1 : z1;
    let x = x1;
    let y = y1;
    let z = z1;
    const points = [];
    let rx = 0;
    let ry = 0;
    let rz = 0;
    const endCoord = qChange[largestChange] === 1 ? startAxis + largestTarget : startAxis - largestTarget;
    for (let i = startAxis; qChange[largestChange] === 1 ? i <= endCoord : i >= endCoord; i += qChange[largestChange]) {
      if (largestChange === 0) {
        if (ry >= dx) {
          ry -= dx;
          y += qChange[1];
        }
        if (rz >= dx) {
          rz -= dx;
          z += qChange[2];
        }
        ry += dy;
        rz += dz;
        points.push(put([i, y, z]));
        continue;
      }
      if (largestChange === 1) {
        if (rx >= dy) {
          rx -= dy;
          x += qChange[0];
        }
        if (rz >= dy) {
          rz -= dy;
          z += qChange[2];
        }
        rx += dx;
        rz += dz;
        points.push(put([x, i, z]));
        continue;
      }
      if (largestChange === 2) {
        if (rx >= dz) {
          rx -= dz;
          x += qChange[2];
        }
        if (ry >= dz) {
          ry -= dz;
          y += qChange[1];
        }
        ry += dy;
        rx += dx;
        points.push(put([x, y, i]));
        continue;
      }
    }
    return points;
  };
  function turtle(actions) {
    const lsys = new LSystem(actions, {});
    return lsys.runProc();
  }

  // build/scripts/src/ifs.js
  var ifs_exports = {};
  __export(ifs_exports, {
    Fractals: () => Fractals,
    create_IFS: () => create_IFS
  });
  var import_server6 = __require("@minecraft/server");
  var IFS = class {
    constructor(f, width = 100, height = 100) {
      this.fractal = [];
      this.x = 0;
      this.y = 0;
      this.scaleX = 1;
      this.scaleY = 1;
      this.offsetX = 0;
      this.offsetY = 0;
      this.track = [];
      this.width = width;
      this.height = height;
      this.readIfs(f);
      this.findBounds();
    }
    readIfs(f) {
      for (let i = 0; i < f.length; i++)
        f[i] = f[i] * 1;
      if (!(f.length > 0 && f.length % 7 == 0)) {
        throw new Error("Invalid IFS");
      } else {
        this.fractal = [];
        for (let i = 0; i < f.length; i += 7) {
          this.fractal.push(f.slice(i, i + 7));
        }
      }
    }
    run(n) {
      for (var i = 0; i < n; i += 1) {
        this.next();
        let px = this.scaleX * this.x + this.offsetX;
        let py = this.scaleY * this.y + this.offsetY;
        this.track.push(new import_server6.BlockLocation(px, 0, py));
      }
      return this.track;
    }
    next() {
      let r = Math.random();
      let probabilityThreshold = 0;
      for (let i = 0; i < this.fractal.length; i += 1) {
        let t = this.fractal[i];
        if (r <= (probabilityThreshold += t[6])) {
          let oldx = this.x;
          this.x = t[0] * this.x + t[1] * this.y + t[4];
          this.y = t[2] * oldx + t[3] * this.y + t[5];
          return i;
        }
      }
    }
    findBounds() {
      let left = 0, right = 0, top = 0, bottom = 0;
      this.x = 0;
      this.y = 0;
      for (let i = 0; i < 100; i += 1) {
        this.next();
      }
      for (let i = 0; i < 1e4; i += 1) {
        this.next();
        if (this.x < left)
          left = this.x;
        if (this.x > right)
          right = this.x;
        if (this.y < bottom)
          bottom = this.y;
        if (this.y > top)
          top = this.y;
      }
      if (top - bottom > right - left) {
        left = (left + right - top + bottom) / 2;
        right = left + top - bottom;
      } else {
        bottom = (bottom + top - right + left) / 2;
        top = bottom + right - left;
      }
      this.scaleX = this.width / (right - left);
      this.scaleY = this.height / (bottom - top);
      this.offsetX = this.width * left / (left - right);
      this.offsetY = this.height * top / (top - bottom);
    }
  };
  function create_IFS(f, width, height) {
    return new IFS(f, width, height);
  }
  var Fractals;
  (function(Fractals2) {
    Fractals2.anchors = [
      0,
      0.1,
      0,
      0.4,
      -2e-3,
      0,
      0.08,
      0.7,
      0.135,
      -0.235,
      0.7,
      -0.2,
      0.01,
      0.45,
      0.121328,
      -0.12,
      0.23,
      0.32318,
      0.01,
      0.01,
      0.25,
      0.121328,
      0.3433,
      0.24,
      0.218,
      0,
      0.01,
      0.22
    ];
    Fractals2.angle = [
      0.5,
      0,
      0,
      0.5,
      -4.5,
      2e-3,
      0.33,
      0.5,
      0,
      0,
      0.5,
      4.6,
      2e-3,
      0.33,
      0.32139,
      0.38302,
      -0.38302,
      0.32139,
      1.09,
      9.5,
      0.33
    ];
    Fractals2.babylon = [
      0,
      -0.5,
      0.85,
      0,
      -1.732366,
      3.366182,
      0.333333,
      0.3,
      0,
      0,
      0.3,
      -0.027891,
      5.014877,
      0.333333,
      0,
      0.5,
      -0.85,
      0,
      1.620804,
      3.310401,
      0.333334
    ];
    Fractals2.batman = [
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0.25,
      0.5,
      0.5,
      0,
      0.5,
      0.5,
      0,
      0.25,
      0.5,
      0,
      0.5,
      0.5,
      0,
      0.5,
      0.25,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0.5,
      0.25
    ];
    Fractals2.boomerang = [
      0.1561,
      -0.878342,
      -0.820365,
      -0.202815,
      1.809888,
      7.967409,
      0.888128,
      -0.036111,
      0.444444,
      0.210185,
      0.037037,
      2.071081,
      8.330552,
      0.111872
    ];
    Fractals2.c = [0.5, 0.5, -0.5, 0.5, 0, 0, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5];
    Fractals2.cantor = [0.333333, 0, 0, 0.333333, 0, 0, 0.5, 0.333333, 0, 0, 0.333333, 0.666667, 0, 0.5];
    Fractals2.castle = [
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0.25,
      0.5,
      0,
      0,
      0.5,
      3,
      0,
      0.25,
      0.4,
      0,
      0,
      0.4,
      0,
      2,
      0.25,
      0.5,
      0,
      0,
      0.5,
      3,
      2,
      0.25
    ];
    Fractals2.claw = [
      0.33333,
      0.33333,
      -0.33333,
      0.33333,
      0,
      0,
      0.33,
      0.4714,
      0,
      0,
      0.4714,
      0.33333,
      -0.33333,
      0.34,
      0.4714,
      0,
      0,
      0.4714,
      0.66667,
      0,
      0.33
    ];
    Fractals2.cloud = [
      0.357,
      0,
      0,
      0.357,
      -5e-3,
      -6e-3,
      0.1,
      0.31,
      -0.1129,
      0.1129,
      0.31,
      0.05,
      5e-3,
      0.1,
      0.435,
      0.0152,
      -0.0152,
      0.435,
      -0.03,
      0.0358,
      0.1,
      0.168,
      -0.2857,
      0.2857,
      0.168,
      -0.04,
      0.018,
      0.1,
      0.2514,
      0.2514,
      -0.2514,
      0.2514,
      0.034,
      0.061,
      0.1,
      0.3457,
      0.1995,
      -0.1995,
      0.3457,
      -9e-3,
      0.079,
      0.1,
      0.2765,
      -0.2765,
      0.2765,
      0.2765,
      -0.04,
      0.09,
      0.2,
      0.1465,
      -0.3,
      0.3,
      0.1465,
      -0.065,
      0.049,
      0.1,
      0.3453,
      0.0121,
      -0.0121,
      0.3453,
      0.025,
      0.0308,
      0.1
    ];
    Fractals2.cloud1 = [
      0.25,
      0,
      0,
      0.25,
      0,
      0,
      0.17,
      0.25,
      -0.25,
      0.25,
      0.25,
      0.25,
      0,
      0.17,
      0.5,
      0.5,
      -0.5,
      0.5,
      0.5,
      0.25,
      0.16,
      0.5,
      0.5,
      -0.5,
      0.5,
      0.25,
      0,
      0.16,
      0.25,
      -0.25,
      0.25,
      0.25,
      0.5,
      -0.25,
      0.17,
      0.25,
      0,
      0,
      0.25,
      0.75,
      0,
      0.17
    ];
    Fractals2.coral = [
      -0.16666667,
      -0.1666667,
      0.16666667,
      -0.1666667,
      0,
      0,
      0.163,
      0.83333333,
      0.25,
      -0.25,
      0.8333333,
      -0.1666667,
      -0.166667,
      0.6,
      0.33333333,
      -0.0833333,
      0.08333333,
      0.3333333,
      0.0833333,
      0.666667,
      0.237
    ];
    Fractals2.coral1 = [
      0.307692,
      -0.531469,
      -0.461538,
      -0.293706,
      5.401953,
      8.655175,
      0.4,
      0.307692,
      -0.076923,
      0.153846,
      -0.447552,
      -1.295248,
      4.15299,
      0.15,
      0,
      0.545455,
      0.692308,
      -0.195804,
      -4.893637,
      7.269794,
      0.45
    ];
    Fractals2.coral2 = [
      0.35355,
      0.35355,
      -0.35355,
      0.35355,
      -4.4,
      2e-3,
      0.33,
      0.383,
      0.383,
      -0.32135,
      0.32135,
      4.8,
      2e-3,
      0.33,
      0.32139,
      0.38302,
      -0.38302,
      0.32139,
      1.9,
      7.5,
      0.33
    ];
    Fractals2.coral3 = [
      0.25,
      -0.25,
      0.25,
      0.25,
      0,
      0,
      0.25,
      0.5,
      0.5,
      -0.5,
      0.5,
      0.25,
      0.25,
      0.5,
      0.25,
      -0.25,
      0.25,
      0.25,
      0.75,
      0.25,
      0.25
    ];
    Fractals2.coral4 = [
      0.396,
      0.3111,
      -0.396,
      0.3111,
      3.7128,
      2.6788,
      0.31,
      -0.2507,
      -0.4673,
      0.2988,
      -0.3921,
      -3.2041,
      3.2104,
      0.32,
      0.6435,
      -0.224,
      0.3,
      0.4803,
      2.8256,
      2.8282,
      0.37
    ];
    Fractals2.cosmos = [0.4578, -0.491, 0.61, 0.911, 1.479, 0.692, 0.9175, 0.56, 0.3, -0.5, 0.9, 0.64, 0.5, 0.5];
    Fractals2.crystal = [
      0.69697,
      -0.481061,
      -0.393939,
      -0.662879,
      2.147003,
      10.310288,
      0.747826,
      0.090909,
      -0.443182,
      0.515152,
      -0.094697,
      4.286558,
      2.925762,
      0.252174
    ];
    Fractals2.crystal1 = [
      0.255,
      0,
      0,
      0.255,
      0.3726,
      0.6714,
      0.2,
      0.255,
      0,
      0,
      0.255,
      0.1146,
      0.2232,
      0.15,
      0.255,
      0,
      0,
      0.255,
      0.6306,
      0.2232,
      0.15,
      0.37,
      -0.642,
      0.642,
      0.37,
      0.6356,
      -61e-4,
      0.75
    ];
    Fractals2.crystal2 = [
      0,
      -0.5,
      0.5,
      0,
      0.5,
      0,
      0.333,
      0,
      0.5,
      -0.5,
      0,
      0.5,
      0.5,
      0.333,
      0.5,
      0,
      0,
      0.5,
      0.25,
      0.5,
      0.333
    ];
    Fractals2.crystal3 = [
      0.1767,
      -0.7071,
      0.7071,
      0.1767,
      0,
      0,
      0.25,
      -0.1767,
      0.7071,
      -0.7071,
      -0.1767,
      0,
      0,
      0.25,
      0.25,
      0,
      0,
      0.25,
      0.5,
      0,
      0.25,
      0.25,
      0,
      0,
      0.25,
      0.75,
      0,
      0.25
    ];
    Fractals2.crystal4 = [
      0.1767,
      -0.7071,
      0.7071,
      0.1767,
      0,
      0,
      0.25,
      -0.1767,
      0.7071,
      -0.7071,
      -0.1767,
      0,
      0,
      0.25,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0.5
    ];
    Fractals2.curl = [0.693, 0.4, -0.4, 0.693, 0, 0, 0.85, 0.346, -0.2, 0.2, 0.346, 0.693, 0.4, 0.15];
    Fractals2.devil = [
      0.333333,
      0,
      0,
      0.5,
      0,
      0,
      0.166667,
      0.333333,
      0,
      0,
      0.5,
      0.333333,
      0,
      0.166667,
      0.333333,
      0,
      0,
      0.5,
      0.666667,
      0,
      0.166667,
      0.333333,
      0,
      0,
      0.5,
      0.666667,
      0.5,
      0.166667,
      -0.333333,
      0,
      0,
      -0.5,
      1,
      0.5,
      0.166667,
      -0.333333,
      0,
      0,
      -0.5,
      0.666667,
      0.5,
      0.166667
    ];
    Fractals2.dogs = [
      0.8517,
      -0.3736,
      0.3736,
      0.7517,
      0,
      0,
      0.7,
      0.3,
      0.1,
      -0.1,
      0.2,
      1,
      -0.364,
      0.1,
      0.3,
      0.1,
      -0.1,
      0.2,
      -0.364,
      1,
      0.1,
      0.3,
      0.1,
      -0,
      0.2,
      -0.728,
      -0.728,
      0.1
    ];
    Fractals2.dragon = [0.5, 0.5, -0.5, 0.5, 0, 0, 0.5, -0.5, 0.5, -0.5, -0.5, 1, 0, 0.5];
    Fractals2.dragon1 = [
      0.824074,
      0.281482,
      -0.212346,
      0.864198,
      -1.88229,
      -0.110607,
      0.787473,
      0.088272,
      0.520988,
      -0.463889,
      -0.377778,
      0.78536,
      8.095795,
      0.212527
    ];
    Fractals2.dragon2 = [
      0.824074,
      0.581482,
      -0.212346,
      0.864198,
      1.88229,
      0.110607,
      0.787473,
      0.088272,
      0.420988,
      -0.463889,
      -0.377778,
      0.78536,
      8.095795,
      0.212528
    ];
    Fractals2.dragons = [
      0.25,
      -0.433,
      0.433,
      0.25,
      0,
      0,
      0.25,
      0.25,
      -0.433,
      0.433,
      0.25,
      0.25,
      0,
      0.25,
      0.25,
      -0.433,
      0.433,
      0.25,
      0.5,
      0,
      0.25,
      0.25,
      -0.433,
      0.433,
      0.25,
      0.75,
      0,
      0.25
    ];
    Fractals2.fern = [
      0,
      0,
      0,
      0.16,
      0,
      0,
      0.01,
      0.85,
      0.04,
      -0.04,
      0.85,
      0,
      1.6,
      0.85,
      0.2,
      -0.26,
      0.23,
      0.22,
      0,
      1.6,
      0.07,
      -0.15,
      0.28,
      0.26,
      0.24,
      0,
      0.44,
      0.07
    ];
    Fractals2.fern1 = [
      0,
      0,
      0,
      0.22,
      0,
      0,
      0.01,
      0.8,
      0.135,
      -0.235,
      0.8,
      0,
      1.4,
      0.49,
      0.15,
      -0.12,
      0.13,
      0.12,
      0,
      1,
      0.25,
      0.15,
      0.2,
      0.34,
      0.12,
      0,
      0.5,
      0.25
    ];
    Fractals2.fern2 = [
      -0.632407,
      -0.3,
      -0.54537,
      0.659259,
      0.53,
      4.282321,
      0.55,
      -0.036111,
      0.444444,
      0.210185,
      0.037037,
      0.52,
      4.330552,
      0.45
    ];
    Fractals2.floor = [
      0,
      -0.5,
      0.5,
      0,
      0.25,
      -0.25,
      0.333333,
      0.5,
      0,
      0,
      0.5,
      0.25,
      0.25,
      0.333333,
      0,
      0.5,
      -0.5,
      0,
      0.75,
      0.25,
      0.333334
    ];
    Fractals2.floor1 = [
      0.5,
      0,
      0,
      0.5,
      -2.563477,
      -3e-6,
      0.333333,
      0.5,
      0,
      0,
      0.5,
      2.436544,
      -3e-6,
      0.333333,
      0,
      -0.5,
      0.5,
      0,
      4.873085,
      7.563492,
      0.333333
    ];
    Fractals2.floor2 = [
      0.333,
      0,
      0,
      0.333,
      0.333,
      0.666,
      0.2,
      0,
      0.333,
      1,
      0,
      0.666,
      0,
      0.4,
      0,
      -0.333,
      1,
      0,
      0.333,
      0,
      0.4
    ];
    Fractals2.flyfish = [0.2, -0.5, 0.5, -0.5, 0.9, 0.5, 0.5, 0.8, 0.5, -0.5, 0.5, 0.9, 0.5, 0.5];
    Fractals2.forest = [
      -0.632407,
      -0.614815,
      -0.54537,
      0.659259,
      3.840822,
      1.282321,
      0.888128,
      -0.036111,
      0.444444,
      0.210185,
      0.037037,
      2.071081,
      8.330552,
      0.111872
    ];
    Fractals2.fournier = [
      0.1666667,
      0,
      0,
      0.1666667,
      0,
      0,
      0.2,
      0.1666667,
      0,
      0,
      0.1666667,
      0.8333333,
      0,
      0.2,
      0.1666667,
      0,
      0,
      0.1666667,
      0,
      0.8333333,
      0.2,
      0.1666667,
      0,
      0,
      0.1666667,
      0.4166667,
      0.4166667,
      0.2,
      0.1666667,
      0,
      0,
      0.1666667,
      0.8333333,
      0.8333333,
      0.2
    ];
    Fractals2.island = [
      0,
      0.577,
      -0.577,
      0,
      0.0951,
      0.5893,
      0.333,
      0,
      0.577,
      -0.577,
      0,
      0.4413,
      0.7893,
      0.333,
      0,
      0.577,
      -0.577,
      0,
      0.0952,
      0.9893,
      0.333
    ];
    Fractals2.klingon = [0.33333, -0.88888, 0.6, -0.4, 9, -1, 0.5, -0.7777, 0.22222, 0.1, 0.5, -1, 15, 0.5];
    Fractals2.koch43 = [
      0.3333,
      0,
      0,
      0.3333,
      0,
      0,
      0.25,
      0.1667,
      -0.2887,
      0.2887,
      0.1667,
      0.3333,
      0,
      0.25,
      0.1667,
      0.2887,
      -0.2887,
      0.1667,
      0.5,
      0.2887,
      0.25,
      0.3333,
      0,
      0,
      0.3333,
      0.6667,
      0,
      0.25
    ];
    Fractals2.koch53 = [
      0.3333,
      0,
      0,
      0.3333,
      0,
      0,
      0.2,
      0.3333,
      0,
      0,
      0.3333,
      0.6667,
      0,
      0.2,
      0.3333,
      0,
      0,
      0.3333,
      0.3333,
      0.3333,
      0.2,
      0,
      -0.3333,
      0.3333,
      0,
      0.3333,
      0,
      0.2,
      0,
      0.3333,
      -0.3333,
      0,
      0.6667,
      0.3333,
      0.2
    ];
    Fractals2.kochmix = [
      0.307692,
      -0,
      0,
      0.294118,
      4.119164,
      1.604278,
      0.151515,
      0.192308,
      -0.205882,
      0.653846,
      0.088235,
      -0.68884,
      5.978916,
      0.253788,
      0.192308,
      0.205882,
      -0.653846,
      0.088235,
      0.66858,
      5.962514,
      0.253788,
      0.307692,
      -0,
      0,
      0.294118,
      -4.13653,
      1.604278,
      0.151515,
      0.384615,
      -0,
      0,
      -0.294118,
      -7718e-6,
      2.941176,
      0.189394
    ];
    Fractals2.leaf = [
      0.555,
      0,
      0,
      0.555,
      0,
      0,
      0.2,
      0.55,
      0,
      0,
      0.55,
      0,
      0.185,
      0.3,
      0.353,
      0.281,
      -0.295,
      0.336,
      0.068,
      0.112,
      0.25,
      0.353,
      -0.281,
      0.295,
      0.336,
      -0.068,
      0.112,
      0.25
    ];
    Fractals2.leaf1 = [
      0.4,
      0,
      0,
      0.4,
      0,
      0,
      0.2,
      0.55,
      0,
      0,
      0.55,
      0,
      0.2,
      0.3,
      0.31,
      0.31,
      -0.31,
      0.31,
      0.1,
      0.1,
      0.25,
      0.31,
      -0.31,
      0.31,
      0.31,
      -0.1,
      0.1,
      0.25
    ];
    Fractals2.leaf2 = [
      0.3333,
      0,
      0,
      0.3333,
      0,
      0,
      0.1667,
      0.1667,
      -0.2887,
      0.2887,
      0.1667,
      0.3333,
      0,
      0.1667,
      0.1667,
      -0.2887,
      0.2887,
      0.1667,
      0.0833,
      0,
      0.1667,
      0.1667,
      0.2887,
      -0.2887,
      0.1667,
      0.3333,
      0,
      0.1667,
      0.1667,
      0.2887,
      -0.2887,
      0.1667,
      0.0833,
      0,
      0.1667,
      0.3333,
      0,
      0,
      0.3333,
      0.6667,
      0,
      0.1667
    ];
    Fractals2.m = [
      0.25,
      -0.25,
      0.25,
      0.25,
      0,
      0,
      0.25,
      0.25,
      0.25,
      -0.25,
      0.25,
      0.25,
      0.25,
      0.25,
      0.25,
      -0.25,
      0.25,
      0.25,
      0.5,
      0,
      0.25,
      0.25,
      0.25,
      -0.25,
      0.25,
      0.75,
      0.25,
      0.25
    ];
    Fractals2.menger = [
      0.333333,
      0,
      0,
      0.333333,
      0,
      0,
      0.125,
      0.333333,
      0,
      0,
      0.333333,
      0.333333,
      0,
      0.125,
      0.333333,
      0,
      0,
      0.333333,
      0.666667,
      0,
      0.125,
      0.333333,
      0,
      0,
      0.333333,
      0,
      0.333333,
      0.125,
      0.333333,
      0,
      0,
      0.333333,
      0,
      0.666667,
      0.125,
      0.333333,
      0,
      0,
      0.333333,
      0.333333,
      0.666667,
      0.125,
      0.333333,
      0,
      0,
      0.333333,
      0.666667,
      0.333333,
      0.125,
      0.333333,
      0,
      0,
      0.333333,
      0.666667,
      0.666667,
      0.125
    ];
    Fractals2.onefive = [
      0.25,
      0,
      0,
      0.25,
      0,
      0,
      0.125,
      0,
      -0.25,
      0.25,
      0,
      0.25,
      0,
      0.125,
      0.25,
      0,
      0,
      0.25,
      0.25,
      0.25,
      0.125,
      0,
      0.25,
      -0.25,
      0,
      0.5,
      0.25,
      0.125,
      0,
      0.25,
      -0.25,
      0,
      0.5,
      0,
      0.125,
      0.25,
      0,
      0,
      0.25,
      0.5,
      -0.25,
      0.125,
      0,
      -0.25,
      0.25,
      0,
      0.75,
      -0.25,
      0.125,
      0.25,
      0,
      0,
      0.25,
      0.75,
      0,
      0.125
    ];
    Fractals2.paw = [0.3, 0.2, -0.8, 0.5, 8e-3, 0.5, 0.45, 0.5, 0.23, -0.56, 0.9, 2e-3, 0.5, 0.45];
    Fractals2.pentagon = [
      0.382,
      0,
      0,
      0.382,
      0.3072,
      0.619,
      0.2,
      0.382,
      0,
      0,
      0.382,
      0.6033,
      0.4044,
      0.2,
      0.382,
      0,
      0,
      0.382,
      0.0139,
      0.4044,
      0.2,
      0.382,
      0,
      0,
      0.382,
      0.1253,
      0.0595,
      0.2,
      0.382,
      0,
      0,
      0.382,
      0.492,
      0.0595,
      0.2
    ];
    Fractals2.petals = [
      0.307692,
      -0.531469,
      -0.461538,
      -0.293706,
      -5.401953,
      8.655175,
      0.4,
      0.307692,
      -0.076923,
      0.153846,
      -0.447552,
      -1.295248,
      -4.15299,
      0.15,
      0,
      0.545455,
      0.692308,
      -0.195804,
      4.893637,
      7.269794,
      0.45
    ];
    Fractals2.petals1 = [
      0.2,
      0,
      0,
      0.3,
      0.2,
      0.4,
      0.13,
      -0.1414,
      0.21213,
      0.1414,
      0.21213,
      -0.3535,
      -0.3535,
      0.13,
      0.383,
      0.3213,
      -0.3213,
      0.383,
      0,
      0,
      0.3,
      0.1928,
      0.2298,
      -0.2298,
      0.1928,
      0.5823,
      -0.32067,
      0.13,
      -0.7,
      0,
      0,
      -0.4,
      -0.1,
      -0.8,
      0.31
    ];
    Fractals2.posies = [
      0.177,
      -0.177,
      0.177,
      0.177,
      0,
      0,
      0.1,
      0.354,
      -0.354,
      0.354,
      0.354,
      0.5,
      0,
      0.4,
      0.177,
      -0.177,
      0.177,
      0.177,
      0.75,
      0.75,
      0.1,
      0.354,
      -0.354,
      0.354,
      0.354,
      0,
      0.5,
      0.4
    ];
    Fractals2.posies1 = [
      0.35355,
      -0.35355,
      0.35355,
      0.35355,
      0,
      0,
      0.5,
      0.35355,
      -0.35355,
      0.35355,
      0.35355,
      0.5,
      0.5,
      0.5
    ];
    Fractals2.posies2 = [
      0.1667,
      0.2887,
      -0.2887,
      0.1667,
      0,
      0,
      0.18,
      0.1667,
      -0.2887,
      0.2887,
      0.1667,
      0.1667,
      -0.866,
      0.19,
      0.1667,
      -0.2887,
      0.2887,
      0.1667,
      0.3333,
      0,
      0.19,
      0.1667,
      0.2887,
      -0.2887,
      0.1667,
      0.5,
      0.866,
      0.19,
      0.3333,
      0,
      0,
      0.3333,
      0.6667,
      0,
      0.25
    ];
    Fractals2.posies3 = [
      0.25,
      0.25,
      -0.25,
      0.25,
      0,
      0,
      0.25,
      0.5,
      -0.5,
      0.5,
      0.5,
      0.25,
      0.25,
      0.5,
      0.25,
      0.25,
      -0.25,
      0.25,
      0.75,
      -0.25,
      0.25
    ];
    Fractals2.ribbon = [
      0.25,
      -0.25,
      0.25,
      0.25,
      0,
      0,
      0.25,
      0.5,
      0.5,
      -0.5,
      0.5,
      0.25,
      0.25,
      0.5,
      0.25,
      -0.25,
      0.25,
      0.25,
      0.75,
      -0.25,
      0.25
    ];
    Fractals2.sails = [
      0.1,
      0.01,
      -1e-4,
      5e-4,
      0,
      0,
      0.01,
      0.85,
      0,
      0,
      0.85,
      0,
      1.2,
      0.85,
      0.2232,
      0.1285,
      0.045,
      0.2413,
      0.4432,
      0.5,
      0.07,
      0.1865,
      0.2563,
      0.012,
      0.0514,
      -0.5,
      0.24,
      0.07
    ];
    Fractals2.satdish = [0.5, 0, 0, 0.5, 0, 0, 0.33, 0, -0.5, 0.5, 0, 0.5, 0, 0.33, 0.5, 0, 0, 0.5, 0.5, 0.5, 0.34];
    Fractals2.schain = [
      0.5,
      0.1,
      0.5,
      0.4,
      -2e-3,
      0,
      0.05,
      0.7,
      0.135,
      -0.235,
      0.7,
      -0.2,
      0.1,
      0.45,
      -0.5,
      -0.1,
      -0.5,
      -0.4,
      2e-3,
      2e-3,
      0.05
    ];
    Fractals2.sierpinski = [
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0.3333,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0.3333,
      0.5,
      0,
      0,
      0.5,
      0.25,
      0.433,
      0.3334
    ];
    Fractals2.sigma = [
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0.333333333333333,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0.333333333333333,
      0.5,
      0,
      0,
      -0.5,
      0.125,
      1,
      0.333333333333334
    ];
    Fractals2.sphinx = [
      -0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0.25,
      -0.5,
      0,
      0,
      0.5,
      1,
      0,
      0.25,
      0.5,
      0,
      0,
      -0.5,
      0.1685,
      0.2919,
      0.25,
      -0.25,
      -0.433,
      0.433,
      -0.25,
      0.9171,
      0.1436,
      0.25
    ];
    Fractals2.spiral = [
      0.787879,
      -0.424242,
      0.242424,
      0.859848,
      1.758647,
      1.408065,
      0.895652,
      -0.121212,
      0.257576,
      0.090909,
      0.05303,
      -3.721654,
      1.377236,
      0.052174,
      0.252525,
      -0.136364,
      0.252525,
      0.181818,
      3.086107,
      1.568035,
      0.052174
    ];
    Fractals2.spiral1 = [
      0.7517,
      -0.2736,
      0.2736,
      0.7517,
      0,
      0,
      0.7,
      0.2,
      0,
      0,
      0.2,
      1,
      -0.364,
      0.1,
      0.2,
      0,
      0,
      0.2,
      -0.364,
      1,
      0.1,
      0.2,
      0,
      0,
      0.2,
      -0.728,
      -0.728,
      0.1
    ];
    Fractals2.spiral2 = [
      0.787879,
      -0.424242,
      0.242424,
      0.859848,
      1.758647,
      1.408065,
      0.895652,
      -0.121212,
      0.257576,
      0.151515,
      0.05303,
      -6.721654,
      1.377236,
      0.052174,
      0.181818,
      -0.136364,
      0.090909,
      0.181818,
      6.086107,
      1.568035,
      0.052174
    ];
    Fractals2.spiral3 = [
      0.745455,
      -0.459091,
      0.406061,
      0.887121,
      1.460279,
      0.691072,
      0.85,
      -0.424242,
      -0.065152,
      -0.175758,
      0.218182,
      3.809567,
      6.741476,
      0.15
    ];
    Fractals2.square = [
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0.25,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0.25,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0.5,
      0.25,
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0.25
    ];
    Fractals2.sticks = [
      5e-3,
      0,
      0,
      0.5,
      0,
      0,
      0.12,
      0.414,
      -0.414,
      0.414,
      0.414,
      0,
      0.5,
      0.44,
      0.414,
      0.414,
      -0.414,
      0.414,
      0,
      0.5,
      0.44
    ];
    Fractals2.swirl = [
      0.745455,
      -0.459091,
      0.406061,
      0.887121,
      1.460279,
      0.691072,
      0.912675,
      -0.424242,
      -0.065152,
      -0.175758,
      -0.218182,
      3.809567,
      6.741476,
      0.087325
    ];
    Fractals2.tower = [0.75, 0, 0, 0.3, -0.2, 0, 0.23, 0.75, 0, 0, 0.3, 0.2, 0, 0.23, 0.5, 0, 0, 0.8, 0, 0.2, 0.54];
    Fractals2.tree = [
      0.195,
      -0.488,
      0.344,
      0.443,
      0.722,
      0.536,
      0.4,
      0.462,
      0.414,
      -0.252,
      0.361,
      0.538,
      1.167,
      0.4,
      -0.058,
      -0.07,
      0.453,
      -0.111,
      1.125,
      0.185,
      0.1,
      -0.045,
      0.091,
      -0.469,
      -0.022,
      0.863,
      0.871,
      0.1
    ];
    Fractals2.tree1 = [
      0.195,
      -0.488,
      0.344,
      0.443,
      0.4431,
      0.2452,
      0.2,
      0.462,
      0.414,
      -0.252,
      0.361,
      0.2511,
      0.5692,
      0.25,
      -0.058,
      -0.07,
      0.453,
      -0.111,
      0.5976,
      0.0969,
      0.2,
      -0.035,
      0.07,
      -0.469,
      -0.022,
      0.4884,
      0.5069,
      0.25,
      -0.637,
      0,
      0,
      0.501,
      0.8562,
      0.2513,
      0.1
    ];
    Fractals2.tree2 = [
      0,
      0,
      0,
      0.6,
      0,
      -0.065,
      0.1,
      0.44,
      0,
      0,
      0.55,
      0,
      0.2,
      0.18,
      0.343,
      -0.248,
      0.199,
      0.429,
      -0.03,
      0.1,
      0.18,
      0.343,
      0.248,
      -0.199,
      0.429,
      0.03,
      0.1,
      0.18,
      0.28,
      -0.35,
      0.28,
      0.35,
      -0.05,
      0,
      0.18,
      0.28,
      0.35,
      -0.28,
      0.35,
      0.05,
      0,
      0.18
    ];
    Fractals2.tree3 = [
      0.125,
      0.433013,
      -0.216506,
      0.25,
      0,
      0.666667,
      0.35,
      0.125,
      -0.433013,
      0.216506,
      0.25,
      0,
      0.666667,
      0.35,
      0,
      0,
      0,
      0.666667,
      0,
      0,
      0.3
    ];
    Fractals2.twig = [
      -0.467,
      0.02,
      -0.113,
      0.015,
      0.4,
      0.4,
      0.2,
      0.387,
      0.43,
      0.43,
      -0.387,
      0.256,
      0.522,
      0.4,
      0.441,
      -0.091,
      -0.091,
      -0.322,
      0.421,
      0.505,
      0.4
    ];
    Fractals2.twig1 = [
      0.125,
      0.433013,
      -0.216506,
      0.25,
      0,
      0.666667,
      0.35,
      0.125,
      -0.433013,
      0.216506,
      0.25,
      0,
      0.666667,
      0.35,
      0,
      0,
      0,
      0.666667,
      0,
      0,
      0.3
    ];
    Fractals2.vortex = [
      0.442552,
      -0.841144,
      0.724386,
      0.538723,
      14.919102,
      9.328625,
      0.912675,
      -0.424242,
      -0.065152,
      -0.175758,
      -0.218182,
      3.809567,
      6.741476,
      0.087325
    ];
    Fractals2.wind = [0.5, 0.5, 0, 0.5, 0, 0, 0.3333, 0.5, 0, 0, 0.5, 3, 0, 0.3333, 0.4, 0, 0, 0.4, 0, 2, 0.3334];
    Fractals2.wreath = [0.475, -0.823, 0.823, 0.475, 1, 1, 0.8, 0.5, 0.5, 0, 0.5, 0.5, 0, 0.2];
  })(Fractals || (Fractals = {}));

  // build/scripts/src/DLA2D.js
  var import_server8 = __require("@minecraft/server");

  // build/scripts/src/utils.js
  var import_server7 = __require("@minecraft/server");
  function Tellraw(Player, ...Message) {
    return `tellraw ${Player} {"rawtext":[{"text":"${now()} ${Message.join("\n")}"}]}`;
  }
  function LocationTrans(pos) {
    return new import_server7.BlockLocation(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
  }
  function now() {
    const date = /* @__PURE__ */ new Date();
    return ["[", date.toTimeString().slice(0, 8), "]"].join("");
  }
  function rand() {
    const p = Math.random();
    if (p > 0.5)
      return Math.random();
    else
      return -Math.random();
  }

  // build/scripts/src/DLA2D.js
  var Point = class {
    constructor(x, y) {
      this.Stucked = false;
      this.x = x;
      this.y = y;
    }
    Vary(steplength) {
      return [this.x + rand() * steplength, this.y + rand() * steplength];
    }
    Walk(width, steplength) {
      let [tox, toy] = this.Vary(steplength);
      while (Math.abs(tox) > width / 2 || Math.abs(toy) > width / 2) {
        [tox, toy] = this.Vary(steplength);
      }
      [this.x, this.y] = [tox, toy];
    }
  };
  var DLASystem = class {
    constructor(width, maxWalk, iterations, step, Temperature, stuck = [], summoner = randPoint) {
      this.width = width;
      this.maxWalk = maxWalk;
      this.iterations = iterations;
      this.Temperature = Temperature;
      this.Walkering = [];
      this.Stucked = [];
      this.step = step;
      this.summoner = summoner;
      if (stuck.length === 0)
        this.Stucked.push(new Point(0, 0));
      else
        this.Stucked = stuck.map((v) => new Point(v.x, v.z));
      while (this.Walkering.length < maxWalk) {
        this.Walkering.push(toPoint(randPoint(this.width)));
      }
    }
    run() {
      while (this.Walkering.length) {
        for (let i = 1; i <= this.iterations; ++i) {
          for (let j = 0; j < this.Walkering.length; ++j) {
            if (this.Walkering[j].Stucked === true)
              continue;
            this.Walkering[j].Walk(this.width, 1);
            for (let k = 0; k < this.Stucked.length; ++k) {
              if (checkStuck(this.Walkering[j], this.Stucked[k], this.step)) {
                this.Walkering[j].Stucked = true;
                this.Stucked.push(this.Walkering[j]);
                break;
              }
            }
          }
          this.Walkering = this.Walkering.filter((v) => v.Stucked === false);
        }
        while (this.Walkering.length < this.maxWalk && this.Temperature > 1) {
          this.Walkering.push(toPoint(randPoint(this.width)));
          this.Temperature *= 0.995;
        }
      }
      return this.Stucked.map((v) => new import_server8.BlockLocation(v.x, 0, v.y));
    }
  };
  function randPoint(width) {
    return [rand() * (width / 2), rand() * (width / 2)];
  }
  function distance(a, b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
  }
  function checkStuck(a, b, step) {
    return distance(a, b) < 1.8 * step;
  }
  function toPoint(arr) {
    return new Point(arr[0], arr[1]);
  }
  function DLA2D(width, maxWalk, iterations, step, Temperature, stuck = [], summoner = randPoint) {
    const sys2 = new DLASystem(width, maxWalk, iterations, step, Temperature, stuck, summoner);
    return sys2.run();
  }

  // build/scripts/src/DLA3D.js
  var import_server9 = __require("@minecraft/server");
  var Point2 = class {
    constructor(x, y, z) {
      this.Stucked = false;
      this.x = x;
      this.y = y;
      this.z = z;
    }
    Vary(steplength) {
      return [this.x + rand() * steplength, this.y + rand() * steplength, this.z + rand() * steplength];
    }
    Walk(width, steplength) {
      let [tox, toy, toz] = this.Vary(steplength);
      while (Math.abs(tox) > width / 2 || Math.abs(toy) > width / 2 || Math.abs(toz) > width / 2) {
        [tox, toy, toz] = this.Vary(steplength);
      }
      [this.x, this.y, this.z] = [tox, toy, toz];
    }
  };
  var DLASystem2 = class {
    constructor(width, maxWalk, iterations, step, Temperature, stuck = [], summoner = randPoint2) {
      this.width = width;
      this.maxWalk = maxWalk;
      this.iterations = iterations;
      this.Temperature = Temperature;
      this.Walkering = [];
      this.Stucked = [];
      this.step = step;
      this.summoner = summoner;
      if (stuck.length === 0)
        this.Stucked.push(new Point2(0, 0, 0));
      else
        this.Stucked = stuck.map((v) => new Point2(v.x, v.y, v.z));
      while (this.Walkering.length < maxWalk) {
        this.Walkering.push(toPoint2(this.summoner(this.width)));
      }
    }
    run() {
      while (this.Walkering.length) {
        for (let i = 1; i <= this.iterations; ++i) {
          for (let j = 0; j < this.Walkering.length; ++j) {
            if (this.Walkering[j].Stucked === true)
              continue;
            this.Walkering[j].Walk(this.width, 1);
            for (let k = 0; k < this.Stucked.length; ++k) {
              if (checkStuck2(this.Walkering[j], this.Stucked[k], this.step)) {
                this.Walkering[j].Stucked = true;
                this.Stucked.push(this.Walkering[j]);
                break;
              }
            }
          }
          this.Walkering = this.Walkering.filter((v) => v.Stucked === false);
        }
        while (this.Walkering.length < this.maxWalk && this.Temperature > 1) {
          this.Walkering.push(toPoint2(this.summoner(this.width)));
          this.Temperature *= 0.995;
        }
      }
      return this.Stucked.map((v) => new import_server9.BlockLocation(v.x, v.y, v.z));
    }
  };
  function randPoint2(width) {
    return [rand() * (width / 2), rand() * (width / 2), rand() * (width / 2)];
  }
  function distance2(a, b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z);
  }
  function checkStuck2(a, b, step) {
    return distance2(a, b) < 1.8 * step;
  }
  function toPoint2(arr) {
    return new Point2(arr[0], arr[1], arr[2]);
  }
  function DLA3D(width, maxWalk, iterations, step, Temperature, stuck = [], summoner = randPoint2) {
    const sys2 = new DLASystem2(width, maxWalk, iterations, step, Temperature, stuck, summoner);
    return sys2.run();
  }

  // build/scripts/src/command.js
  var Sandbox = class {
    // boxProxy: Object;
    constructor(sandbox) {
      this.sandbox = sandbox;
    }
    eval(code) {
      const body = `with(inside) { ${code} }`;
      const fn2 = new Function("inside", body);
      return fn2(this.sandbox);
    }
    updateEnv(...env) {
      Object.assign(this.sandbox, ...env);
    }
  };

  // build/scripts/src/system.js
  var System = class {
    // callbacks: { [key: string]: Function } = {};
    constructor() {
      this.operator = null;
      this.funcs = {
        ...generator_exports,
        ...expression_exports,
        ...transform_exports,
        ...PureEval_exports,
        ...lsystem_exports,
        ...ifs_exports,
        DLA2D,
        DLA3D,
        // Effect
        plot: this.plot,
        place: this.placeMode,
        brush: this.brush,
        say: this.tellraw,
        code: this.codeEditor,
        getpos: () => {
          this.setPosition(this.getPlayerPosition());
        }
      };
      this.callbacks = {};
      this.savedCode = "";
      this.setting = {
        block: import_server10.MinecraftBlockTypes.stainedGlass,
        origin: new import_server10.BlockLocation(0, 0, 0),
        brush_item: "minecraft:stick",
        console: "minecraft:blaze_rod"
      };
      this.dimension = import_server10.world.getDimension("overworld");
      for (const p of this.dimension.getPlayers({ closest: 5 })) {
        this.operator = p;
      }
      this.evaluator = new Sandbox(this.funcs);
      this.evaluator.updateEnv(this.setting);
    }
    run() {
      this.subscribe();
      import_server10.world.events.worldInitialize.subscribe(() => this.boardcast("Voxel Geometry :: System initialized"));
      this.watch_dog();
    }
    // Subscribe
    subscribe() {
      import_server10.world.events.itemUse.subscribe((eventData) => {
        if (eventData.item.typeId === this.setting.console) {
          this.codeEditor(this.operator);
        }
      });
      import_server10.world.events.beforeChat.subscribe((eventData) => {
        const player = eventData.sender;
        if (this.operator === null)
          this.operator = player;
        const Chat = eventData.message;
        if (Chat.startsWith("-")) {
          eventData.cancel = true;
          const script = Chat.substring(1).trim();
          this.tellraw(`<< \xA73${script}`);
          this.evaluator.updateEnv({
            callbacks: this.callbacks,
            setBlock: this.setBlock,
            setting: this.setting,
            operator: player,
            dimension: this.dimension
          });
          try {
            const result2 = this.evaluator.eval(script);
            if (result2) {
              this.tellraw(`>> \xA7e${result2}`);
            } else {
              this.tellraw(`>> \xA7eSuccess`);
            }
          } catch (e) {
            this.tellraw(`>> \xA74${e}`);
          }
        }
      });
      import_server10.world.events.blockPlace.subscribe(() => {
      });
    }
    // Code editor : For long script editing
    codeEditor(player) {
      const m = new import_server_ui.ModalFormData();
      m.title("Voxel Geometry");
      m.textField("Console", "code here", this.savedCode);
      m.show(player).then((v) => {
        if (!v.canceled) {
          v.formValues?.forEach((v2) => {
            this.savedCode = v2;
            this.evaluator.updateEnv({
              callbacks: this.callbacks,
              setBlock: this.setBlock,
              setting: this.setting,
              operator: player,
              dimension: this.dimension
            });
            try {
              const result2 = this.evaluator.eval(v2);
              if (result2) {
                this.tellraw(`>> \xA7e${result2}`);
              } else {
                this.tellraw(`>> \xA7eSuccess`);
              }
            } catch (e) {
              this.tellraw(`>> \xA74${e}`);
            }
          });
        }
      });
    }
    // World Action
    fill(blockType, begin, end) {
      const [xFrom, yFrom, zFrom, xTo, yTo, zTo] = [begin.x, begin.y, begin.z, end.x, end.y, end.z];
      for (let x = xFrom; x <= xTo; ++x) {
        for (let y = yFrom; y <= yTo; ++y) {
          for (let z = zFrom; z <= zTo; ++z) {
            this.dimension.getBlock(new import_server10.BlockLocation(x, y, z)).setType(blockType);
          }
        }
      }
    }
    plot(blocks, pos = this.setting.origin, tile = this.setting.block) {
      blocks.forEach((block) => {
        this.setBlock(tile, new import_server10.BlockLocation(block.x + pos.x, block.y + pos.y, block.z + pos.z));
      });
    }
    setBlocks(blockType, blocks) {
      blocks.forEach((block) => {
        this.dimension.getBlock(block).setType(blockType);
      });
    }
    setBlock(block, pos) {
      this.dimension.getBlock(pos).setType(block);
    }
    placeMode(blocks = []) {
      if (this.callbacks["place"]) {
        const callback = this.callbacks["place"];
        import_server10.world.events.blockPlace.unsubscribe(callback);
        delete this.callbacks["place"];
      }
      if (blocks.length !== 0) {
        this.callbacks["place"] = import_server10.world.events.blockPlace.subscribe((eventData) => {
          const pos = eventData.block.location;
          const block = eventData.block.type;
          this.plot(blocks, pos, block);
        });
      }
    }
    brush(blocks = []) {
      if (this.callbacks["brush"]) {
        const callback = this.callbacks["brush"];
        import_server10.world.events.itemUse.unsubscribe(callback);
        delete this.callbacks["brush"];
      }
      if (blocks.length !== 0) {
        this.callbacks["brush"] = import_server10.world.events.itemUse.subscribe((eventData) => {
          const opt = {
            maxDistance: 256,
            includeLiquidBlocks: false,
            includePassableBlocks: true
          };
          const block = eventData.source.getBlockFromViewVector(opt);
          if (block != void 0 && eventData.item.typeId === this.setting.brush_item) {
            const pos = block.location;
            this.plot(blocks, pos);
          }
        });
      }
    }
    cloneArea(target, begin, end) {
      const [xFrom, yFrom, zFrom, xTo, yTo, zTo] = [begin.x, begin.y, begin.z, end.x, end.y, end.z];
      for (let x = xFrom; x <= xTo; ++x) {
        for (let y = yFrom; y <= yTo; ++y) {
          for (let z = zFrom; z <= zTo; ++z) {
            this.setBlock(this.getBlock(new import_server10.BlockLocation(x, y, z)), new import_server10.BlockLocation(target.x + x - xFrom, target.y + y - yFrom, target.z + z - zFrom));
          }
        }
      }
    }
    // Info :
    tellraw(...message) {
      this.dimension.runCommandAsync(Tellraw(this.operator.name, ...message.map((m) => `\xA76${m}`)));
    }
    boardcast(...message) {
      this.dimension.runCommandAsync(Tellraw("@a", ...message.map((m) => `\xA7e${m}`)));
    }
    getPlayerPosition() {
      return LocationTrans(this.operator.location);
    }
    getBlock(pos) {
      return this.dimension.getBlock(pos).type;
    }
    // Modify config
    setPosition(pos) {
      this.setting.origin = pos;
    }
    getItemInHand() {
      const playerComp = this.operator?.getComponent("inventory");
      return playerComp.container.getItem(this.operator.selectedSlot);
    }
    // Watch Dog
    watch_dog() {
      import_server10.system.events.beforeWatchdogTerminate.subscribe((e) => {
        if (e.terminateReason == "hang") {
          e.cancel = true;
        }
      });
    }
  };

  // build/scripts/main.js
  var sys = new System();
  sys.run();
})();

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.call = call;
exports.prefixOperator = exports.infixOperator = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _extends3 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _expression = require("./expression");
var _formulaUtils = require("./formula-utils");
/* eslint-disable no-use-before-define */

function call(name) {
  var upperName = name.toUpperCase();
  if (prefixOperator.hasOwnProperty(upperName)) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      args.isExpressionArgumentsArray = true;
      return prefixOperator[upperName](function () {
        return args;
      });
    };
  }
  if (infixOperator.hasOwnProperty(upperName)) {
    return function () {
      return infixOperator[upperName](arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
    };
  }
  throw new Error("Unknown function: ".concat(name));
}
var prefixOperatorCustom = {
  IS_NUMBER: function IS_NUMBER(arg) {
    try {
      return !Number.isNaN((0, _formulaUtils.num)(arg()));
    } catch (error) {
      return false;
    }
  },
  IS_STRING: function IS_STRING(arg) {
    try {
      return !!(0, _formulaUtils.string)(arg());
    } catch (error) {
      return false;
    }
  },
  IS_ARRAY: function IS_ARRAY(arg) {
    try {
      return !!(0, _formulaUtils.array)(arg());
    } catch (error) {
      return false;
    }
  },
  IS_DICT: function IS_DICT(arg) {
    try {
      return !!(0, _formulaUtils.obj)(arg());
    } catch (error) {
      return false;
    }
  },
  IS_DATE: function IS_DATE(arg) {
    try {
      return !!(0, _formulaUtils.date)(arg());
    } catch (error) {
      return false;
    }
  },
  IS_EMAIL: function IS_EMAIL(arg) {
    try {
      return !!(0, _formulaUtils.string)(arg()).match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    } catch (error) {
      return false;
    }
  },
  IS_HTML_EMPTY: function IS_HTML_EMPTY(arg) {
    try {
      var value = (0, _formulaUtils.string)(arg());
      if (!value) return true;
      if (value === "<div></div>") return true;
      if (value === "<span></span>") return true;
      return false;
    } catch (error) {
      return false;
    }
  },
  DATE_MIN: function DATE_MIN(date1, date2) {
    try {
      var d1 = (0, _formulaUtils.date)(date1());
      var d2 = (0, _formulaUtils.date)(date2());
      return d1 > d2;
    } catch (error) {
      return false;
    }
  },
  DATE_MAX: function DATE_MAX(date1, date2) {
    try {
      var d1 = (0, _formulaUtils.date)(date1());
      var d2 = (0, _formulaUtils.date)(date2());
      return d2 > d1;
    } catch (error) {
      return false;
    }
  }
};
var infixOperator = {
  "+": function _(a, b) {
    return (0, _formulaUtils.num)(a()) + (0, _formulaUtils.num)(b());
  },
  "-": function _(a, b) {
    return (0, _formulaUtils.num)(a()) - (0, _formulaUtils.num)(b());
  },
  "*": function _(a, b) {
    return (0, _formulaUtils.num)(a()) * (0, _formulaUtils.num)(b());
  },
  "/": function _(a, b) {
    return (0, _formulaUtils.num)(a()) / (0, _formulaUtils.num)(b());
  },
  ",": function _(a, b) {
    var aVal = a();
    var aArr = (0, _expression.isExpressionArgumentsArray)(aVal) ? aVal : [function () {
      return aVal;
    }];
    var args = aArr.concat([b]);
    args.isExpressionArgumentsArray = true;
    return args;
  },
  "%": function _(a, b) {
    return (0, _formulaUtils.num)(a()) % (0, _formulaUtils.num)(b());
  },
  "=": function _(a, b) {
    return a() === b();
  },
  "!=": function _(a, b) {
    return a() !== b();
  },
  "<>": function _(a, b) {
    return a() !== b();
  },
  "~=": function _(a, b) {
    return Math.abs((0, _formulaUtils.num)(a()) - (0, _formulaUtils.num)(b())) < Number.EPSILON;
  },
  ">": function _(a, b) {
    return a() > b();
  },
  "<": function _(a, b) {
    return a() < b();
  },
  ">=": function _(a, b) {
    return a() >= b();
  },
  "<=": function _(a, b) {
    return a() <= b();
  },
  AND: function AND(a, b) {
    return a() && b();
  },
  OR: function OR(a, b) {
    return a() || b();
  },
  "^": function _(a, b) {
    return Math.pow((0, _formulaUtils.num)(a()), (0, _formulaUtils.num)(b()));
  }
};
exports.infixOperator = infixOperator;
var prefixOperator = (0, _extends3["default"])({}, prefixOperatorCustom, {
  NEG: function NEG(arg) {
    return -(0, _formulaUtils.num)(arg());
  },
  ADD: function ADD(a, b) {
    return (0, _formulaUtils.num)(a()) + (0, _formulaUtils.num)(b());
  },
  SUB: function SUB(a, b) {
    return (0, _formulaUtils.num)(a()) - (0, _formulaUtils.num)(b());
  },
  MUL: function MUL(a, b) {
    return (0, _formulaUtils.num)(a()) * (0, _formulaUtils.num)(b());
  },
  DIV: function DIV(a, b) {
    return (0, _formulaUtils.num)(a()) / (0, _formulaUtils.num)(b());
  },
  MOD: function MOD(a, b) {
    return (0, _formulaUtils.num)(a()) % (0, _formulaUtils.num)(b());
  },
  NOT: function NOT(arg) {
    return !arg();
  },
  "!": function _(arg) {
    return !arg();
  },
  CEIL: function CEIL(arg) {
    return Math.ceil((0, _formulaUtils.num)(arg()));
  },
  FLOOR: function FLOOR(arg) {
    return Math.floor((0, _formulaUtils.num)(arg()));
  },
  ROUND: function ROUND(arg) {
    return Math.round((0, _formulaUtils.num)(arg()));
  },
  IF: function IF(arg1, arg2, arg3) {
    var condition = arg1;
    var thenStatement = arg2;
    var elseStatement = arg3;
    if (condition()) {
      return thenStatement();
    }
    return elseStatement();
  },
  AVERAGE: function AVERAGE(arg) {
    var arr = (0, _formulaUtils.evalArray)(arg());
    var sum = arr.reduce(function (prev, curr) {
      return prev + (0, _formulaUtils.num)(curr);
    }, 0);
    return (0, _formulaUtils.num)(sum) / arr.length;
  },
  SUM: function SUM(arg) {
    return (0, _formulaUtils.evalArray)(arg(), _formulaUtils.num).reduce(function (prev, curr) {
      return prev + (0, _formulaUtils.num)(curr);
    }, 0);
  },
  CHAR: function CHAR(arg) {
    return String.fromCharCode((0, _formulaUtils.num)(arg()));
  },
  CODE: function CODE(arg) {
    return (0, _formulaUtils["char"])(arg()).charCodeAt(0);
  },
  // array
  MIN: function MIN(arg) {
    return (0, _formulaUtils.evalArray)(arg()).reduce(function (prev, curr) {
      return Math.min(prev, (0, _formulaUtils.num)(curr));
    }, Number.POSITIVE_INFINITY);
  },
  MAX: function MAX(arg) {
    return (0, _formulaUtils.evalArray)(arg()).reduce(function (prev, curr) {
      return Math.max(prev, (0, _formulaUtils.num)(curr));
    }, Number.NEGATIVE_INFINITY);
  },
  SORT: function SORT(arg) {
    var arr = (0, _formulaUtils.array)(arg()).slice();
    arr.sort();
    return arr;
  },
  REVERSE: function REVERSE(arg) {
    var arr = (0, _formulaUtils.array)(arg()).slice();
    arr.reverse();
    return arr;
  },
  INDEX: function INDEX(arg1, arg2) {
    return (0, _formulaUtils.iterable)(arg1())[(0, _formulaUtils.num)(arg2())];
  },
  LENGTH: function LENGTH(arg) {
    return (0, _formulaUtils.iterable)(arg()).length;
  },
  JOIN: function JOIN(arg1, arg2) {
    return (0, _formulaUtils.evalArray)(arg2()).join((0, _formulaUtils.string)(arg1()));
  },
  STRING: function STRING(arg) {
    return (0, _formulaUtils.evalArray)(arg()).join("");
  },
  SPLIT: function SPLIT(arg1, arg2) {
    return (0, _formulaUtils.string)(arg2()).split((0, _formulaUtils.string)(arg1()));
  },
  CHARARRAY: function CHARARRAY(arg) {
    var str = (0, _formulaUtils.string)(arg());
    return str.split("");
  },
  ARRAY: function ARRAY(arg) {
    var val = arg();
    return (0, _expression.isExpressionArgumentsArray)(val) ? val.slice() : [val];
  },
  ISNAN: function ISNAN(arg) {
    return Number.isNaN((0, _formulaUtils.num)(arg()));
  },
  MAP: function MAP(arg1, arg2) {
    var func = arg1();
    var arr = (0, _formulaUtils.evalArray)(arg2());
    return arr.map(function (val) {
      if ((0, _formulaUtils.callbackShouldAThunk)(func)) {
        return function () {
          return func(val);
        };
      }
      return call((0, _formulaUtils.string)(func))(function () {
        return val;
      });
    });
  },
  REDUCE: function REDUCE(arg1, arg2, arg3) {
    var func = arg1();
    var start = arg2();
    var arr = (0, _formulaUtils.evalArray)(arg3());
    return arr.reduce(function (prev, curr) {
      var args = [function () {
        return prev;
      }, function () {
        return curr;
      }];
      if ((0, _formulaUtils.callbackShouldAThunk)(func)) {
        return func.apply(void 0, args);
      }
      return call((0, _formulaUtils.string)(func)).apply(void 0, args);
    }, start);
  },
  RANGE: function RANGE(arg1, arg2) {
    var start = (0, _formulaUtils.num)(arg1());
    var limit = (0, _formulaUtils.num)(arg2());
    var result = [];
    for (var i = start; i < limit; i++) {
      result.push(i);
    }
    return result;
  },
  UPPER: function UPPER(arg) {
    return (0, _formulaUtils.string)(arg()).toUpperCase();
  },
  LOWER: function LOWER(arg) {
    return (0, _formulaUtils.string)(arg()).toLowerCase();
  },
  TAKE: function TAKE(arg1, arg2) {
    var n = (0, _formulaUtils.num)(arg1());
    var arr = (0, _formulaUtils.evalArray)(arg2());
    return arr.slice(0, n);
  },
  DROP: function DROP(arg1, arg2) {
    var n = (0, _formulaUtils.num)(arg1());
    var arr = (0, _formulaUtils.evalArray)(arg2());
    return arr.slice(n);
  },
  SLICE: function SLICE(arg1, arg2, arg3) {
    var start = (0, _formulaUtils.num)(arg1());
    var limit = (0, _formulaUtils.num)(arg2());
    var arr = (0, _formulaUtils.evalArray)(arg3());
    return arr.slice(start, limit);
  },
  CONCAT: function CONCAT(arg1, arg2) {
    var arr1 = (0, _formulaUtils.array)(arg1());
    var arr2 = (0, _formulaUtils.array)(arg2());
    return arr1.concat(arr2);
  },
  HEAD: function HEAD(arg1) {
    var arr = (0, _formulaUtils.array)(arg1());
    return arr[0];
  },
  TAIL: function TAIL(arg1) {
    var arr = (0, _formulaUtils.array)(arg1());
    return arr.slice(1);
  },
  LAST: function LAST(arg1) {
    var arr = (0, _formulaUtils.array)(arg1());
    return arr[arr.length - 1];
  },
  CONS: function CONS(arg1, arg2) {
    var head = arg1();
    var arr = (0, _formulaUtils.array)(arg2());
    return [head].concat(arr);
  },
  FILTER: function FILTER(arg1, arg2) {
    var func = arg1();
    var arr = (0, _formulaUtils.evalArray)(arg2());
    var result = [];
    arr.forEach(function (val) {
      var isSatisfied;
      if ((0, _formulaUtils.callbackShouldAThunk)(func)) {
        isSatisfied = (0, _formulaUtils.evalBool)(func(val));
      } else {
        isSatisfied = (0, _formulaUtils.evalBool)(call((0, _formulaUtils.string)(func))(function () {
          return val;
        }));
      }
      if (isSatisfied) {
        result.push(val);
      }
    });
    return result;
  },
  TAKEWHILE: function TAKEWHILE(arg1, arg2) {
    var func = arg1();
    var arr = (0, _formulaUtils.evalArray)(arg2());
    var satisfaction = function satisfaction(val) {
      var isSatisfied;
      if ((0, _formulaUtils.callbackShouldAThunk)(func)) {
        isSatisfied = (0, _formulaUtils.evalBool)(func(val));
      } else {
        isSatisfied = (0, _formulaUtils.evalBool)(call((0, _formulaUtils.string)(func))(function () {
          return val;
        }));
      }
      return isSatisfied;
    };
    var i = 0;
    while (satisfaction(arr[i]) && i < arr.length) {
      i++;
    }
    return arr.slice(0, i);
  },
  DROPWHILE: function DROPWHILE(arg1, arg2) {
    var func = arg1();
    var arr = (0, _formulaUtils.evalArray)(arg2());
    var satisfaction = function satisfaction(val) {
      var isSatisfied;
      if ((0, _formulaUtils.callbackShouldAThunk)(func)) {
        isSatisfied = (0, _formulaUtils.evalBool)(func(val));
      } else {
        isSatisfied = (0, _formulaUtils.evalBool)(call((0, _formulaUtils.string)(func))(function () {
          return val;
        }));
      }
      return isSatisfied;
    };
    var i = 0;
    while (satisfaction(arr[i]) && i < arr.length) {
      i++;
    }
    return arr.slice(i);
  },
  GET: function GET(arg1, arg2) {
    var key = (0, _formulaUtils.string)(arg1());
    var inputObj = (0, _formulaUtils.obj)(arg2());
    return inputObj[key];
  },
  PUT: function PUT(arg1, arg2, arg3) {
    var key = (0, _formulaUtils.string)(arg1());
    var value = arg2();
    var inputObj = (0, _formulaUtils.obj)(arg3());
    return (0, _extends3["default"])({}, inputObj, (0, _defineProperty2["default"])({}, key, value));
  },
  DICT: function DICT(arg1, arg2) {
    var arr1 = (0, _formulaUtils.evalArray)(arg1());
    var arr2 = (0, _formulaUtils.evalArray)(arg2());
    var result = {};
    arr1.forEach(function (v1, i) {
      var key = (0, _formulaUtils.string)(v1);
      result[key] = arr2[i];
    });
    return result;
  },
  UNZIPDICT: function UNZIPDICT(arg1) {
    var arr = (0, _formulaUtils.evalArray)(arg1());
    var result = {};
    arr.forEach(function (item) {
      var kvPair = (0, _formulaUtils.array)(item);
      if (kvPair.length !== 2) {
        throw new Error("UNZIPDICT: Expected sub-array of length 2");
      }
      var _kvPair = (0, _slicedToArray2["default"])(kvPair, 2),
        key = _kvPair[0],
        value = _kvPair[1];
      try {
        result[(0, _formulaUtils.evalString)(key)] = value;
      } catch (err) {
        throw new Error("UNZIPDICT keys; ".concat(err.message));
      }
    });
    return result;
  },
  KEYS: function KEYS(arg1) {
    var inputObj = (0, _formulaUtils.obj)(arg1());
    return Object.keys(inputObj).sort();
  },
  VALUES: function VALUES(arg1) {
    var inputObj = (0, _formulaUtils.obj)(arg1());
    return Object.keys(inputObj).sort().map(function (key) {
      return inputObj[key];
    });
  }
});
exports.prefixOperator = prefixOperator;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArgumentsArray = exports.formula = exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _extends3 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */

var isArgumentsArray = function isArgumentsArray(args) {
  return Array.isArray(args) && !!args.isArgumentsArray;
};
exports.isArgumentsArray = isArgumentsArray;
var unpackArgs = function unpackArgs(f) {
  return function (expr) {
    var result = expr();
    if (!isArgumentsArray(result)) {
      if (f.length > 1) {
        throw new Error("Too few arguments. Expected ".concat(f.length, ", found 1 (").concat(JSON.stringify(result), ")"));
      }
      return f(function () {
        return result;
      });
    }
    if (result.length === f.length || f.length === 0) {
      // eslint-disable-next-line prefer-spread
      return f.apply(null, result);
    }
    throw new Error("Incorrect number of arguments. Expected ".concat(f.length));
  };
};
var num = function num(result) {
  if (typeof result !== 'number') {
    throw new Error("Expected number, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  return result;
};
var array = function array(result) {
  if (!Array.isArray(result)) {
    throw new Error("Expected array, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  if (isArgumentsArray(result)) {
    throw new Error('Expected array, found: arguments');
  }
  return result;
};
var bool = function bool(value) {
  if (typeof value !== 'boolean') {
    throw new Error("Expected boolean, found: ".concat((0, _typeof2["default"])(value), " ").concat(JSON.stringify(value)));
  }
  return value;
};
var evalBool = function evalBool(value) {
  var result;
  while (typeof value === 'function' && value.length === 0) {
    result = value();
  }
  if (!result) {
    result = value;
  }
  return bool(result);
};
var evalArray = function evalArray(arr, typeCheck) {
  return array(arr).map(function (value) {
    var result;
    if (typeof value === 'function' && value.length === 0) {
      result = value();
    } else {
      result = value;
    }
    if (typeCheck) {
      try {
        result = typeCheck(result);
      } catch (err) {
        throw new Error("In array; ".concat(err.message));
      }
    }
    return result;
  });
};
var obj = function obj(_obj) {
  if ((0, _typeof2["default"])(_obj) !== 'object' || _obj === null) {
    throw new Error("Expected object, found: ".concat((0, _typeof2["default"])(_obj), " ").concat(JSON.stringify(_obj)));
  } else if (Array.isArray(_obj)) {
    throw new Error('Expected object, found array');
  }
  return _obj;
};
var iterable = function iterable(result) {
  if (!Array.isArray(result) && typeof result !== 'string') {
    throw new Error("Expected array or string, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  return result;
};
var string = function string(result) {
  if (typeof result !== 'string') {
    throw new Error("Expected string, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  return result;
};
var _char = function _char(result) {
  if (typeof result !== 'string' || result.length !== 1) {
    throw new Error("Expected char, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  return result;
};
var date = function date(result) {
  if ("".concat(result) === 'Invalid Date') {
    throw new Error("Expected date, found: ".concat((0, _typeof2["default"])(result)));
  }
  if (result instanceof Date) return result;
  if (!(typeof result === 'string' || typeof result === 'number')) {
    throw new Error("Expected string or number, found: ".concat((0, _typeof2["default"])(result)));
  }
  var parseToDate = new Date(result);
  if ("".concat(parseToDate) === 'Invalid Date') {
    throw new Error("Expected string or number date format, found: ".concat((0, _typeof2["default"])(result)));
  }
  return parseToDate;
};
var evalString = function evalString(value) {
  var result;
  if (typeof value === 'function' && value.length === 0) {
    result = value();
  } else {
    result = value;
  }
  return string(result);
};

// eslint-disable-next-line no-unused-vars

var formula = function formula(_termDelegate, termTypeDelegate) {
  var call = function call(name) {
    var upperName = name.toUpperCase();
    if (prefixOps.hasOwnProperty(upperName)) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        args.isArgumentsArray = true;
        return prefixOps[upperName](function () {
          return args;
        });
      };
    }
    if (infixOps.hasOwnProperty(upperName)) {
      return function () {
        return infixOps[upperName](arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
      };
    }
    throw new Error("Unknown function: ".concat(name));
  };
  var infixOps = {
    '+': function _(a, b) {
      return num(a()) + num(b());
    },
    '-': function _(a, b) {
      return num(a()) - num(b());
    },
    '*': function _(a, b) {
      return num(a()) * num(b());
    },
    '/': function _(a, b) {
      return num(a()) / num(b());
    },
    ',': function _(a, b) {
      var aVal = a();
      var aArr = isArgumentsArray(aVal) ? aVal : [function () {
        return aVal;
      }];
      var args = aArr.concat([b]);
      args.isArgumentsArray = true;
      return args;
    },
    '%': function _(a, b) {
      return num(a()) % num(b());
    },
    '=': function _(a, b) {
      return a() === b();
    },
    '!=': function _(a, b) {
      return a() !== b();
    },
    '<>': function _(a, b) {
      return a() !== b();
    },
    '~=': function _(a, b) {
      return Math.abs(num(a()) - num(b())) < Number.EPSILON;
    },
    '>': function _(a, b) {
      return a() > b();
    },
    '<': function _(a, b) {
      return a() < b();
    },
    '>=': function _(a, b) {
      return a() >= b();
    },
    '<=': function _(a, b) {
      return a() <= b();
    },
    AND: function AND(a, b) {
      return a() && b();
    },
    OR: function OR(a, b) {
      return a() || b();
    },
    '^': function _(a, b) {
      return Math.pow(num(a()), num(b()));
    }
  };
  var prefixOps = {
    IS_NUMBER: function IS_NUMBER(arg) {
      try {
        return !Number.isNaN(num(arg()));
      } catch (error) {
        return false;
      }
    },
    IS_STRING: function IS_STRING(arg) {
      try {
        return !!string(arg());
      } catch (error) {
        return false;
      }
    },
    IS_ARRAY: function IS_ARRAY(arg) {
      try {
        return !!array(arg());
      } catch (error) {
        return false;
      }
    },
    IS_DICT: function IS_DICT(arg) {
      try {
        return !!obj(arg());
      } catch (error) {
        return false;
      }
    },
    IS_DATE: function IS_DATE(arg) {
      try {
        return !!date(arg());
      } catch (error) {
        return false;
      }
    },
    IS_EMAIL: function IS_EMAIL(arg) {
      try {
        return !!string(arg()).match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      } catch (error) {
        return false;
      }
    },
    IS_HTML_EMPTY: function IS_HTML_EMPTY(arg) {
      try {
        var _value = string(arg());
        if (!_value) return true;
        if (_value === '<div></div>') return true;
        if (_value === '<span></span>') return true;
        return false;
      } catch (error) {
        return false;
      }
    },
    DATE_MIN: function DATE_MIN(date1, date2) {
      try {
        var d1 = date(date1());
        var d2 = date(date2());
        return d1 > d2;
      } catch (error) {
        return false;
      }
    },
    DATE_MAX: function DATE_MAX(date1, date2) {
      try {
        var d1 = date(date1());
        var d2 = date(date2());
        return d2 > d1;
      } catch (error) {
        return false;
      }
    },
    INCLUDES: function INCLUDES(arg1, arg2) {
      var item = arg1();
      var arr = evalArray(arg2());
      return arr.includes(item);
    },
    NEG: function NEG(arg) {
      return -num(arg());
    },
    MOD: function MOD(a, b) {
      return num(a()) % num(b());
    },
    NOT: function NOT(arg) {
      return !arg();
    },
    '!': function _(arg) {
      return !arg();
    },
    ADD: function ADD(a, b) {
      return num(a()) + num(b());
    },
    SUB: function SUB(a, b) {
      return num(a()) - num(b());
    },
    MUL: function MUL(a, b) {
      return num(a()) * num(b());
    },
    DIV: function DIV(a, b) {
      return num(a()) / num(b());
    },
    ABS: function ABS(arg) {
      return Math.abs(num(arg()));
    },
    CEIL: function CEIL(arg) {
      return Math.ceil(num(arg()));
    },
    EXP: function EXP(arg) {
      return Math.exp(num(arg()));
    },
    FLOOR: function FLOOR(arg) {
      return Math.floor(num(arg()));
    },
    ROUND: function ROUND(arg) {
      return Math.round(num(arg()));
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
      var arr = evalArray(arg());
      var sum = arr.reduce(function (prev, curr) {
        return prev + num(curr);
      }, 0);
      return num(sum) / arr.length;
    },
    SUM: function SUM(arg) {
      return evalArray(arg(), num).reduce(function (prev, curr) {
        return prev + num(curr);
      }, 0);
    },
    CHAR: function CHAR(arg) {
      return String.fromCharCode(num(arg()));
    },
    CODE: function CODE(arg) {
      return _char(arg()).charCodeAt(0);
    },
    MIN: function MIN(arg) {
      return evalArray(arg()).reduce(function (prev, curr) {
        return Math.min(prev, num(curr));
      }, Number.POSITIVE_INFINITY);
    },
    MAX: function MAX(arg) {
      return evalArray(arg()).reduce(function (prev, curr) {
        return Math.max(prev, num(curr));
      }, Number.NEGATIVE_INFINITY);
    },
    SORT: function SORT(arg) {
      var arr = array(arg()).slice();
      arr.sort();
      return arr;
    },
    REVERSE: function REVERSE(arg) {
      var arr = array(arg()).slice();
      arr.reverse();
      return arr;
    },
    INDEX: function INDEX(arg1, arg2) {
      return iterable(arg1())[num(arg2())];
    },
    LENGTH: function LENGTH(arg) {
      return iterable(arg()).length;
    },
    JOIN: function JOIN(arg1, arg2) {
      return evalArray(arg2()).join(string(arg1()));
    },
    STRING: function STRING(arg) {
      return evalArray(arg()).join('');
    },
    SPLIT: function SPLIT(arg1, arg2) {
      return string(arg2()).split(string(arg1()));
    },
    CHARARRAY: function CHARARRAY(arg) {
      var str = string(arg());
      return str.split('');
    },
    ARRAY: function ARRAY(arg) {
      var val = arg();
      return isArgumentsArray(val) ? val.slice() : [val];
    },
    MAP: function MAP(arg1, arg2) {
      var func = arg1();
      var arr = evalArray(arg2());
      return arr.map(function (val) {
        if (typeof func === 'function') {
          return function () {
            return func(val);
          };
        }
        return call(string(func))(function () {
          return val;
        });
      });
    },
    MAP_ITEM: function MAP_ITEM(arg1, arg2) {
      var item = string(arg1());
      var arr = evalArray(arg2());
      return arr.map(function (val) {
        return val[item];
      });
    },
    EVERY: function EVERY(arg1, arg2) {
      var varg1 = arg1();
      var arr = evalArray(arg2());
      return arr.every(function (item) {
        return item === varg1;
      });
    },
    EVERY_IS: function EVERY_IS(arg1, arg2) {
      var func = arg1();
      var arr = evalArray(arg2());
      return arr.every(function (item) {
        var args = [function () {
          return item;
        }];
        return call(string(func)).apply(void 0, args);
      });
    },
    EVERY_WHILE: function EVERY_WHILE(arg1, arg2, arg3) {
      var func = arg1();
      var value = arg2();
      var arr = evalArray(arg3());
      return arr.every(function (item) {
        var args = [function () {
          return value;
        }, function () {
          return item;
        }];
        if (typeof func === 'function') {
          return func.apply(void 0, args);
        }
        return call(string(func)).apply(void 0, args);
      });
    },
    REDUCE: function REDUCE(arg1, arg2, arg3) {
      var func = arg1();
      var start = arg2();
      var arr = evalArray(arg3());
      return arr.reduce(function (prev, curr) {
        var args = [function () {
          return prev;
        }, function () {
          return curr;
        }];
        if (typeof func === 'function') {
          return func.apply(void 0, args);
        }
        return call(string(func)).apply(void 0, args);
      }, start);
    },
    RANGE: function RANGE(arg1, arg2) {
      var start = num(arg1());
      var limit = num(arg2());
      var result = [];
      for (var i = start; i < limit; i++) {
        result.push(i);
      }
      return result;
    },
    UPPER: function UPPER(arg) {
      return string(arg()).toUpperCase();
    },
    LOWER: function LOWER(arg) {
      return string(arg()).toLowerCase();
    },
    ZIP: function ZIP(arg1, arg2) {
      var arr1 = evalArray(arg1());
      var arr2 = evalArray(arg2());
      if (arr1.length !== arr2.length) {
        throw new Error('ZIP: Arrays are of different lengths');
      } else {
        return arr1.map(function (v1, i) {
          return [v1, arr2[i]];
        });
      }
    },
    UNZIP: function UNZIP(arg1) {
      var inputArr = evalArray(arg1());
      var arr1 = inputArr.map(function (item) {
        return array(item)[0];
      });
      var arr2 = inputArr.map(function (item) {
        return array(item)[1];
      });
      return [arr1, arr2];
    },
    CONCAT: function CONCAT(arg1, arg2) {
      var arr1 = array(arg1());
      var arr2 = array(arg2());
      return arr1.concat(arr2);
    },
    CONS: function CONS(arg1, arg2) {
      var head = arg1();
      var arr = array(arg2());
      return [head].concat(arr);
    },
    FILTER: function FILTER(arg1, arg2) {
      var func = arg1();
      var arr = evalArray(arg2());
      var result = [];
      arr.forEach(function (val) {
        var isSatisfied;
        if (typeof func === 'function') {
          isSatisfied = evalBool(func(val));
        } else {
          isSatisfied = evalBool(call(string(func))(function () {
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
      var arr = evalArray(arg2());
      var satisfaction = function satisfaction(val) {
        var isSatisfied;
        if (typeof func === 'function') {
          isSatisfied = evalBool(func(val));
        } else {
          isSatisfied = evalBool(call(string(func))(function () {
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
      var arr = evalArray(arg2());
      var satisfaction = function satisfaction(val) {
        var isSatisfied;
        if (typeof func === 'function') {
          isSatisfied = evalBool(func(val));
        } else {
          isSatisfied = evalBool(call(string(func))(function () {
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
      var key = string(arg1());
      var inputObj = obj(arg2());
      return inputObj[key];
    },
    PUT: function PUT(arg1, arg2, arg3) {
      var key = string(arg1());
      var value = arg2();
      var inputObj = obj(arg3());
      return (0, _extends3["default"])({}, inputObj, (0, _defineProperty2["default"])({}, key, value));
    },
    DICT: function DICT(arg1, arg2) {
      var arr1 = evalArray(arg1());
      var arr2 = evalArray(arg2());
      var result = {};
      arr1.forEach(function (v1, i) {
        var key = string(v1);
        result[key] = arr2[i];
      });
      return result;
    },
    UNZIPDICT: function UNZIPDICT(arg1) {
      var arr = evalArray(arg1());
      var result = {};
      arr.forEach(function (item) {
        var kvPair = array(item);
        if (kvPair.length !== 2) {
          throw new Error('UNZIPDICT: Expected sub-array of length 2');
        }
        var _kvPair = (0, _slicedToArray2["default"])(kvPair, 2),
          key = _kvPair[0],
          value = _kvPair[1];
        try {
          result[evalString(key)] = value;
        } catch (err) {
          throw new Error("UNZIPDICT keys; ".concat(err.message));
        }
      });
      return result;
    },
    KEYS: function KEYS(arg1) {
      var inputObj = obj(arg1());
      return Object.keys(inputObj).sort();
    },
    VALUES: function VALUES(arg1) {
      var inputObj = obj(arg1());
      return Object.keys(inputObj).sort().map(function (key) {
        return inputObj[key];
      });
    }
  };

  // Ensure arguments are unpacked accordingly
  // Except for the ARRAY constructor
  Object.keys(prefixOps).forEach(function (key) {
    if (key !== 'ARRAY') {
      prefixOps[key] = unpackArgs(prefixOps[key]);
    }
  });
  return {
    ESCAPE_CHAR: '\\',
    INFIX_OPS: infixOps,
    PREFIX_OPS: prefixOps,
    PRECEDENCE: [Object.keys(prefixOps), ['^'], ['*', '/', '%', 'MOD'], ['+', '-'], ['<', '>', '<=', '>='], ['=', '!=', '<>', '~='], ['AND', 'OR'], [',']],
    LITERAL_OPEN: '"',
    LITERAL_CLOSE: '"',
    GROUP_OPEN: '(',
    GROUP_CLOSE: ')',
    SEPARATOR: ' ',
    SYMBOLS: ['^', '*', '/', '%', '+', '-', '<', '>', '=', '!', ',', '"', '(', ')', '[', ']', '~'],
    AMBIGUOUS: {
      '-': 'NEG'
    },
    SURROUNDING: {
      ARRAY: {
        OPEN: '[',
        CLOSE: ']'
      }
    },
    termDelegate: function termDelegate(term) {
      var numVal = parseFloat(term);
      if (Number.isNaN(numVal)) {
        switch (term) {
          case 'FALSE':
            return false;
          case 'TRUE':
            return true;
          case 'EMPTY':
            return [];
          case 'EMPTYDICT':
            return {};
          case 'INFINITY':
            return Number.POSITIVE_INFINITY;
          case 'EPSILON':
            return Number.EPSILON;
          case 'UNDEFINED':
            return undefined;
          default:
            return _termDelegate(term);
        }
      } else {
        return numVal;
      }
    },
    termTyper: function termTyper(term) {
      var numVal = parseFloat(term);
      if (Number.isNaN(numVal)) {
        switch (term) {
          case 'FALSE':
            return 'boolean';
          case 'TRUE':
            return 'boolean';
          case 'EMPTY':
            return 'array';
          case 'INFINITY':
            return 'number';
          case 'EPSILON':
            return 'number';
          default:
            return termTypeDelegate ? termTypeDelegate(term) : 'unknown';
        }
      } else {
        return 'number';
      }
    },
    isCaseInsensitive: true
  };
};
exports.formula = formula;
var _default = formula;
exports["default"] = _default;
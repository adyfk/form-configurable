"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = exports.obj = exports.num = exports.iterable = exports.evalString = exports.evalBool = exports.evalArray = exports.date = exports["char"] = exports.callbackShouldAThunk = exports.bool = exports.array = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _expression = require("./expression");
var callbackShouldAThunk = function callbackShouldAThunk(func) {
  if (typeof func === "function") {
    return true;
  }
  return false;
};
exports.callbackShouldAThunk = callbackShouldAThunk;
var num = function num(result) {
  if (typeof result !== "number") {
    throw new Error("Expected number, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  return result;
};
exports.num = num;
var array = function array(result) {
  if (!Array.isArray(result)) {
    throw new Error("Expected array, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  if ((0, _expression.isExpressionArgumentsArray)(result)) {
    throw new Error("Expected array, found: arguments");
  }
  return result;
};
exports.array = array;
var bool = function bool(value) {
  if (typeof value !== "boolean") {
    throw new Error("Expected boolean, found: ".concat((0, _typeof2["default"])(value), " ").concat(JSON.stringify(value)));
  }
  return value;
};
exports.bool = bool;
var obj = function obj(_obj) {
  if ((0, _typeof2["default"])(_obj) !== "object" || _obj === null) {
    throw new Error("Expected object, found: ".concat((0, _typeof2["default"])(_obj), " ").concat(JSON.stringify(_obj)));
  } else if (Array.isArray(_obj)) {
    throw new Error("Expected object, found array");
  }
  return _obj;
};
exports.obj = obj;
var iterable = function iterable(result) {
  if (!Array.isArray(result) && typeof result !== "string") {
    throw new Error("Expected array or string, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  return result;
};
exports.iterable = iterable;
var string = function string(result) {
  if (typeof result !== "string") {
    throw new Error("Expected string, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  return result;
};
exports.string = string;
var _char = function _char(result) {
  if (typeof result !== "string" || result.length !== 1) {
    throw new Error("Expected char, found: ".concat((0, _typeof2["default"])(result), " ").concat(JSON.stringify(result)));
  }
  return result;
};
exports["char"] = _char;
var date = function date(result) {
  if ("".concat(result) === "Invalid Date") {
    throw new Error("Expected date, found: ".concat((0, _typeof2["default"])(result)));
  }
  if (result instanceof Date) return result;
  if (!(typeof result === "string" || typeof result === "number")) {
    throw new Error("Expected string or number, found: ".concat((0, _typeof2["default"])(result)));
  }
  var parseToDate = new Date(result);
  if ("".concat(parseToDate) === "Invalid Date") {
    throw new Error("Expected string or number date format, found: ".concat((0, _typeof2["default"])(result)));
  }
  return parseToDate;
};
exports.date = date;
var evalString = function evalString(value) {
  var result;
  if (typeof value === "function" && value.length === 0) {
    result = value();
  } else {
    result = value;
  }
  return string(result);
};
exports.evalString = evalString;
var evalBool = function evalBool(value) {
  var result;
  while (typeof value === "function" && value.length === 0) {
    result = value();
  }
  if (!result) {
    result = value;
  }
  return bool(result);
};
exports.evalBool = evalBool;
var evalArray = function evalArray(arr, typeCheck) {
  return array(arr).map(function (value) {
    var result;
    if (typeof value === "function" && value.length === 0) {
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
exports.evalArray = evalArray;
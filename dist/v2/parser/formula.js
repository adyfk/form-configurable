"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formula = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _expression = require("./expression");
var _formulaOperator = require("./formula-operator");
/* eslint-disable indent */
/* eslint-disable no-use-before-define */

var unpackArgs = function unpackArgs(f) {
  return function (expr) {
    var result = expr();
    if (!(0, _expression.isExpressionArgumentsArray)(result)) {
      if (f.length > 1) {
        throw new Error("Too few arguments. Expected ".concat(f.length, ", found 1 (").concat(JSON.stringify(result), ")"));
      }
      return f(function () {
        return result;
      });
    }
    if (result.length === f.length || f.length === 0) {
      return f(result);
    }
    throw new Error("Incorrect number of arguments. Expected ".concat(f.length));
  };
};

// eslint-disable-next-line func-names
var formula = function formula(_termDelegate, termTypeDelegate) {
  // callable
  var prefixOps = (0, _extends2["default"])({}, _formulaOperator.prefixOperator);
  var infixOps = (0, _extends2["default"])({}, _formulaOperator.infixOperator);
  Object.keys(prefixOps).forEach(function (key) {
    if (key !== "ARRAY") {
      prefixOps[key] = unpackArgs(prefixOps[key]);
    }
  });
  return {
    ESCAPE_CHAR: "\\",
    INFIX_OPS: infixOps,
    PREFIX_OPS: prefixOps,
    PRECEDENCE: [Object.keys(prefixOps), ["^"], ["*", "/", "%", "MOD"], ["+", "-"], ["<", ">", "<=", ">="], ["=", "!=", "<>", "~="], ["AND", "OR"], [","]],
    LITERAL_OPEN: "\"",
    LITERAL_CLOSE: "\"",
    GROUP_OPEN: "(",
    GROUP_CLOSE: ")",
    SEPARATOR: " ",
    SYMBOLS: ["^", "*", "/", "%", "+", "-", "<", ">", "=", "!", ",", "\"", "(", ")", "[", "]", "~"],
    AMBIGUOUS: {
      "-": "NEG"
    },
    SURROUNDING: {
      ARRAY: {
        OPEN: "[",
        CLOSE: "]"
      }
    },
    termDelegate: function termDelegate(term) {
      var numVal = parseFloat(term);
      if (Number.isNaN(numVal)) {
        switch (term) {
          case "PI":
            return Math.PI;
          case "FALSE":
            return false;
          case "TRUE":
            return true;
          case "EMPTY":
            return [];
          case "EMPTYDICT":
            return {};
          case "INFINITY":
            return Number.POSITIVE_INFINITY;
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
          case "SQRT2":
            return "number";
          case "FALSE":
            return "boolean";
          case "TRUE":
            return "boolean";
          case "EMPTY":
            return "array";
          case "INFINITY":
            return "number";
          default:
            return termTypeDelegate ? termTypeDelegate(term) : "unknown";
        }
      } else {
        return "number";
      }
    }
  };
};
exports.formula = formula;
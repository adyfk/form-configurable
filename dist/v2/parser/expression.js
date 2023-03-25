"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isExpressionArgumentsArray = exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* eslint-disable indent */
/* eslint-disable no-use-before-define */

// init value

// eslint-disable-next-line max-classes-per-file

// ==================================================================================================

// term

// ==================================================================================================

// expression options

// ==================================================================================================

var isExpressionArgumentsArray = function isExpressionArgumentsArray(args) {
  return Array.isArray(args) && !!args.isExpressionArgumentsArray;
};
exports.isExpressionArgumentsArray = isExpressionArgumentsArray;
var thunkEvaluator = function thunkEvaluator(val) {
  return evaluate(val);
};
var mapValues = function mapValues(mapper) {
  return function (obj) {
    var result = {};
    Object.keys(obj).forEach(function (key) {
      result[key] = mapper(obj[key]);
    });
    return result;
  };
};
var objEvaluator = mapValues(thunkEvaluator);
var evaluate = function evaluate(thunkExpression) {
  if (typeof thunkExpression === "function" && thunkExpression.length === 0) {
    return evaluate(thunkExpression());
  }
  if (isExpressionArgumentsArray(thunkExpression)) {
    return thunkExpression.map(function (val) {
      return evaluate(val());
    });
  }
  if (Array.isArray(thunkExpression)) {
    return thunkExpression.map(thunkEvaluator);
  }
  if ((0, _typeof2["default"])(thunkExpression) === "object") {
    return objEvaluator(thunkExpression);
  }
  return thunkExpression;
};
var thunk = function thunk(delegate) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return function () {
    return delegate.apply(void 0, args);
  };
};
var ExpressionParser = /*#__PURE__*/function () {
  // eslint-disable-next-line prefer-regex-literals

  // eslint-disable-next-line prefer-regex-literals

  function ExpressionParser(options) {
    var _this = this;
    (0, _classCallCheck2["default"])(this, ExpressionParser);
    this.options = {};
    this.surroundingOpen = {};
    this.surroundingClose = {};
    this.symbols = {};
    this.LIT_CLOSE_REGEX = new RegExp("\"$");
    this.LIT_OPEN_REGEX = new RegExp("^\"$");
    this.options = options;
    this.surroundingOpen = {};
    this.surroundingClose = {};
    this.symbols = {};
    if (this.options.SURROUNDING) {
      Object.keys(this.options.SURROUNDING).forEach(function (key) {
        var _SURROUNDING;
        var item = (_SURROUNDING = _this.options.SURROUNDING) == null ? void 0 : _SURROUNDING[key];
        var open = item.OPEN;
        var close = item.CLOSE;
        _this.surroundingOpen[open] = true;
        _this.surroundingClose[close] = {
          OPEN: open,
          ALIAS: key
        };
      });
    }
    if (this.options.LITERAL_OPEN) {
      this.LIT_CLOSE_REGEX = new RegExp("".concat(this.options.LITERAL_OPEN, "$"));
    }
    if (this.options.LITERAL_CLOSE) {
      this.LIT_OPEN_REGEX = new RegExp("^".concat(this.options.LITERAL_CLOSE));
    }
    this.options.SYMBOLS.forEach(function (symbol) {
      _this.symbols[symbol] = symbol;
    });
  }
  (0, _createClass2["default"])(ExpressionParser, [{
    key: "isSymbol",
    value: function isSymbol(_char) {
      return this.symbols[_char] === _char;
    }
  }, {
    key: "getPrefixOp",
    value: function getPrefixOp(op) {
      if (this.options.termTyper && this.options.termTyper(op) === "function") {
        var termValue = this.options.termDelegate(op);
        if (typeof termValue !== "function") {
          throw new Error("".concat(op, " is not a function."));
        }
        var result = termValue;
        return function (argsThunk) {
          var args = evaluate(argsThunk);
          if (!Array.isArray(args)) {
            return function () {
              return result(args);
            };
          }
          return function () {
            return result.apply(void 0, (0, _toConsumableArray2["default"])(args));
          };
        };
      }
      return this.options.PREFIX_OPS[op];
    }
  }, {
    key: "getInfixOp",
    value: function getInfixOp(op) {
      return this.options.INFIX_OPS[op];
    }
  }, {
    key: "getPrecedence",
    value: function getPrecedence(op) {
      var i;
      var len;
      if (this.options.termTyper && this.options.termTyper(op) === "function") {
        return 0;
      }
      var casedOp = op;
      for (i = 0, len = this.options.PRECEDENCE.length; i !== len; ++i) {
        if (this.options.PRECEDENCE[i].includes(casedOp)) {
          return i;
        }
      }
      return i;
    }
  }, {
    key: "resolveAmbiguity",
    value: function resolveAmbiguity(token) {
      var _this$options$AMBIGUO, _this$options;
      return (_this$options$AMBIGUO = (_this$options = this.options) == null ? void 0 : _this$options.AMBIGUOUS[token]) != null ? _this$options$AMBIGUO : token;
    }
  }, {
    key: "tokenize",
    value: function tokenize(expression) {
      var _this2 = this;
      var tokens = [];
      var token = "";
      var isScanningLiteral = false;
      var isScanningSymbols = false;
      var isEscaping = false;
      for (var i = 0; i < expression.length; i++) {
        var currChar = expression[i];
        if (isEscaping) {
          token += currChar;
          isEscaping = false;
          continue;
        }
        if (currChar === this.options.ESCAPE_CHAR) {
          isEscaping = true;
          continue;
        }
        if (isScanningLiteral) {
          if (currChar === this.options.LITERAL_CLOSE) {
            tokens.push(this.options.LITERAL_OPEN + token + this.options.LITERAL_CLOSE);
            token = "";
            isScanningLiteral = false;
          } else {
            token += currChar;
          }
          continue;
        }
        if (currChar === this.options.LITERAL_OPEN) {
          tokens.push(token);
          token = "";
          isScanningLiteral = true;
          continue;
        }
        if (currChar === this.options.SEPARATOR) {
          if (token !== "") {
            tokens.push(token);
            token = "";
          }
          continue;
        }
        if (currChar === this.options.GROUP_OPEN || currChar === this.options.GROUP_CLOSE) {
          if (token !== "") {
            tokens.push(token);
            token = "";
          }
          tokens.push(currChar);
          continue;
        }
        if (currChar in this.surroundingOpen || currChar in this.surroundingClose) {
          if (token !== "") {
            tokens.push(token);
            token = "";
          }
          tokens.push(currChar);
          continue;
        }
        var isSymbol = this.isSymbol(currChar);
        if (isSymbol !== isScanningSymbols) {
          if (token !== "") {
            tokens.push(token);
            token = "";
          }
          isScanningSymbols = isSymbol;
        }
        token += currChar;
      }
      if (token !== "") {
        tokens.push(token);
      }
      return tokens.map(function (t) {
        return _this2.resolveAmbiguity(t);
      });
    }
  }, {
    key: "isSurroundingOpen",
    value: function isSurroundingOpen(token) {
      return this.surroundingOpen[token] !== undefined;
    }
  }, {
    key: "isSurroundingClose",
    value: function isSurroundingClose(token) {
      return this.surroundingClose[token] !== undefined;
    }
  }, {
    key: "getSurroundingToken",
    value: function getSurroundingToken(token) {
      return this.surroundingClose[token];
    }
  }, {
    key: "tokensToRpn",
    value: function tokensToRpn(tokens) {
      var output = [];
      var stack = [];
      var grouping = [];

      // eslint-disable-next-line no-restricted-syntax
      var _iterator = _createForOfIteratorHelper(tokens),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _token3 = _step.value;
          var isInfix = this.getInfixOp(_token3) !== undefined;
          var isPrefix = this.getPrefixOp(_token3) !== undefined;
          if (isInfix || isPrefix) {
            var tokenPrecedence = this.getPrecedence(_token3);
            var lastInStack = stack[stack.length - 1];
            while (lastInStack && (!!this.getPrefixOp(lastInStack) && this.getPrecedence(lastInStack) < tokenPrecedence || !!this.getInfixOp(lastInStack) && this.getPrecedence(lastInStack) <= tokenPrecedence)) {
              output.push(stack.pop());
              lastInStack = stack[stack.length - 1];
            }
            stack.push(_token3);
          } else if (this.isSurroundingOpen(_token3)) {
            stack.push(_token3);
            grouping.push(_token3);
          } else if (this.isSurroundingClose(_token3)) {
            var _surroundingToken = this.getSurroundingToken(_token3);
            if (grouping.pop() !== _surroundingToken.OPEN) {
              throw new Error("Mismatched Grouping (unexpected closing \"".concat(_token3, "\")"));
            }
            var poppedToken = stack.pop();
            while (poppedToken !== _surroundingToken.OPEN && poppedToken !== undefined) {
              output.push(poppedToken);
              poppedToken = stack.pop();
            }
            if (poppedToken === undefined) {
              throw new Error("Mismatched Grouping");
            }
            stack.push(_surroundingToken.ALIAS);
          } else if (_token3 === this.options.GROUP_OPEN) {
            stack.push(_token3);
            grouping.push(_token3);
          } else if (_token3 === this.options.GROUP_CLOSE) {
            if (grouping.pop() !== this.options.GROUP_OPEN) {
              throw new Error("Mismatched Grouping (unexpected closing \"".concat(_token3, "\")"));
            }
            var _poppedToken = stack.pop();
            while (_poppedToken !== this.options.GROUP_OPEN && _poppedToken !== undefined) {
              output.push(_poppedToken);
              _poppedToken = stack.pop();
            }
            if (_poppedToken === undefined) {
              throw new Error("Mismatched Grouping");
            }
          } else {
            output.push(_token3);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      while (stack.length !== 0) {
        var _token2 = stack.pop();
        if (this.isSurroundingClose(_token2)) {
          var surroundingToken = this.getSurroundingToken(_token2);
          if (grouping.pop() !== surroundingToken.OPEN) {
            throw new Error("Mismatched Grouping (unexpected closing \"".concat(_token2, "\")"));
          }
        } else if (_token2 === this.options.GROUP_CLOSE) {
          if (grouping.pop() !== this.options.GROUP_OPEN) {
            throw new Error("Mismatched Grouping (unexpected closing \"".concat(_token2, "\")"));
          }
        }
        output.push(_token2);
      }
      if (grouping.length !== 0) {
        throw new Error("Mismatched Grouping (unexpected \"".concat(grouping.pop(), "\")"));
      }
      return output;
    }
  }, {
    key: "evaluateRpn",
    value: function evaluateRpn(stack, infixer, prefixer, terminator, terms) {
      var lhs;
      var rhs;
      var token = stack.pop();
      if (typeof token === "undefined") {
        throw new Error("Parse Error: unexpected EOF");
      }
      var isInfixDelegate = !!this.getInfixOp(token);
      var isPrefixDelegate = !!this.getPrefixOp(token);
      var isInfix = isInfixDelegate && stack.length > 1;
      var isPrefix = isPrefixDelegate && stack.length > 0;
      if (isInfix || isPrefix) {
        rhs = this.evaluateRpn(stack, infixer, prefixer, terminator, terms);
      }
      if (isInfix) {
        lhs = this.evaluateRpn(stack, infixer, prefixer, terminator, terms);
        return infixer(token, lhs, rhs);
      }
      if (isPrefix) {
        return prefixer(token, rhs);
      }
      return terminator(token, terms);
    }
  }, {
    key: "rpnToThunk",
    value: function rpnToThunk(stack, terms) {
      var _this3 = this;
      var infixExpr = function infixExpr(term, lhs, rhs) {
        return thunk(_this3.getInfixOp(term), lhs, rhs);
      };
      var prefixExpr = function prefixExpr(term, rhs) {
        return thunk(_this3.getPrefixOp(term), rhs);
      };
      var termExpr = function termExpr(term, terms) {
        var _this3$options;
        if ((_this3$options = _this3.options) != null && _this3$options.LITERAL_OPEN && term.startsWith(_this3.options.LITERAL_OPEN)) {
          // Literal string
          return function () {
            return term.replace(_this3.LIT_OPEN_REGEX, "").replace(_this3.LIT_CLOSE_REGEX, "");
          };
        }
        return terms != null && terms.hasOwnProperty(term) ? function () {
          return terms[term];
        } : thunk(_this3.options.termDelegate, term);
      };
      return this.evaluateRpn(stack, infixExpr, prefixExpr, termExpr, terms);
    }
  }, {
    key: "rpnToValue",
    value: function rpnToValue(stack, terms) {
      return evaluate(this.rpnToThunk(stack, terms));
    }
  }, {
    key: "expressionToValue",
    value: function expressionToValue(expression, terms) {
      return this.rpnToValue(this.tokensToRpn(this.tokenize(expression)), terms);
    }
  }]);
  return ExpressionParser;
}();
var _default = ExpressionParser;
exports["default"] = _default;
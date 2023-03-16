"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expressionToValue = void 0;
var _expressionparser = require("expressionparser");
var _formula_override = _interopRequireDefault(require("./formula_override"));
var parser = (0, _expressionparser.init)(_formula_override["default"], function (term) {
  return term;
});
var expressionToValue = function expressionToValue(expresssion, data) {
  return parser.expressionToValue(expresssion, data);
};
exports.expressionToValue = expressionToValue;
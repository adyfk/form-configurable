"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createParser = void 0;
var _expression = _interopRequireDefault(require("./expression"));
var _formula = require("./formula");
var createParser = function createParser() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _formula.formula;
  return new _expression["default"](config(function (val) {
    return val;
  }));
};
exports.createParser = createParser;
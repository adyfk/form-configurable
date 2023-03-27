"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createParser = void 0;
var _parser = require("../../parser");
var _formula = require("./formula");
var createParser = function createParser() {
  var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _formula.formula;
  return _parser.parser;
};
exports.createParser = createParser;
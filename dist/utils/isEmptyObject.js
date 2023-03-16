"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _isObject = _interopRequireDefault(require("./isObject"));
var _default = function _default(value) {
  return (0, _isObject["default"])(value) && !Object.keys(value).length;
};
exports["default"] = _default;
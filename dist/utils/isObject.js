"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObjectType = exports["default"] = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _isDateObject = _interopRequireDefault(require("./isDateObject"));
var _isNullOrUndefined = _interopRequireDefault(require("./isNullOrUndefined"));
var isObjectType = function isObjectType(value) {
  return (0, _typeof2["default"])(value) === 'object';
};
exports.isObjectType = isObjectType;
var _default = function _default(value) {
  return !(0, _isNullOrUndefined["default"])(value) && !Array.isArray(value) && isObjectType(value) && !(0, _isDateObject["default"])(value);
};
exports["default"] = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _compact = _interopRequireDefault(require("./compact"));
var _isNullOrUndefined = _interopRequireDefault(require("./isNullOrUndefined"));
var _isObject = _interopRequireDefault(require("./isObject"));
var _isUndefined = _interopRequireDefault(require("./isUndefined"));
/* eslint-disable no-nested-ternary */
var _default = function _default(obj, path, defaultValue) {
  if (!path || !(0, _isObject["default"])(obj)) {
    return defaultValue;
  }
  var result = (0, _compact["default"])(path.split(/[,[\].]+?/)).reduce(function (result, key) {
    return (0, _isNullOrUndefined["default"])(result) ? result : result[key];
  }, obj);
  return (0, _isUndefined["default"])(result) || result === obj ? (0, _isUndefined["default"])(obj[path]) ? defaultValue : obj[path] : result;
};
exports["default"] = _default;
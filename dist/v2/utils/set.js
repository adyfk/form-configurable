"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = set;
var _isKey = _interopRequireDefault(require("./isKey"));
var _isObject = _interopRequireDefault(require("./isObject"));
var _stringToPath = _interopRequireDefault(require("./stringToPath"));
/* eslint-disable no-nested-ternary */

function set(object, path, value) {
  var index = -1;
  var tempPath = (0, _isKey["default"])(path) ? [path] : (0, _stringToPath["default"])(path);
  var length = tempPath.length;
  var lastIndex = length - 1;
  while (++index < length) {
    var key = tempPath[index];
    var newValue = value;
    if (index !== lastIndex) {
      var objValue = object[key];
      newValue = (0, _isObject["default"])(objValue) || Array.isArray(objValue) ? objValue : !Number.isNaN(+tempPath[index + 1]) ? [] : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = unset;
var _isEmptyObject = _interopRequireDefault(require("./isEmptyObject"));
var _isKey = _interopRequireDefault(require("./isKey"));
var _isObject = _interopRequireDefault(require("./isObject"));
var _isUndefined = _interopRequireDefault(require("./isUndefined"));
var _stringToPath = _interopRequireDefault(require("./stringToPath"));
/* eslint-disable no-nested-ternary */

function baseGet(object, updatePath) {
  var _updatePath$slice = updatePath.slice(0, -1),
    length = _updatePath$slice.length;
  var index = 0;
  while (index < length) {
    object = (0, _isUndefined["default"])(object) ? index++ : object[updatePath[index++]];
  }
  return object;
}
function isEmptyArray(obj) {
  for (var key in obj) {
    if (!(0, _isUndefined["default"])(obj[key])) {
      return false;
    }
  }
  return true;
}
function unset(object, path) {
  var paths = Array.isArray(path) ? path : (0, _isKey["default"])(path) ? [path] : (0, _stringToPath["default"])(path);
  var childObject = paths.length === 1 ? object : baseGet(object, paths);
  var index = paths.length - 1;
  var key = paths[index];
  if (childObject) {
    delete childObject[key];
  }
  if (index !== 0 && ((0, _isObject["default"])(childObject) && (0, _isEmptyObject["default"])(childObject) || Array.isArray(childObject) && isEmptyArray(childObject))) {
    unset(object, paths.slice(0, -1));
  }
  return object;
}
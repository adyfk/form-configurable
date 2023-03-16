"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var createPath = function createPath(_ref) {
  var parent = _ref.parent,
    index = _ref.index,
    child = _ref.child;
  return "".concat(parent, "[").concat(index, "].").concat(child);
};
var _default = createPath;
exports["default"] = _default;
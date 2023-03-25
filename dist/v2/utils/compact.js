"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = function _default(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
};
exports["default"] = _default;
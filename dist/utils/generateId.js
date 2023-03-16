"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var generateId = function generateId() {
  return Math.random().toString(36).slice(2);
};
var _default = generateId;
exports["default"] = _default;
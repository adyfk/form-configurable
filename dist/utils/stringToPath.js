"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _compact = _interopRequireDefault(require("./compact"));
var _default = function _default(input) {
  return (0, _compact["default"])(input.replace(/["|']|\]/g, '').split(/\.|\[/));
};
exports["default"] = _default;
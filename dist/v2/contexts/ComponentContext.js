"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ComponentContext = void 0;
var _react = require("react");
var ComponentContext = /*#__PURE__*/(0, _react.createContext)({
  components: {
    "FIELD-ARRAY": {},
    "FIELD-OBJECT": {},
    FIELD: {},
    GROUP: {},
    VIEW: {}
  }
});
exports.ComponentContext = ComponentContext;
var _default = ComponentContext;
exports["default"] = _default;
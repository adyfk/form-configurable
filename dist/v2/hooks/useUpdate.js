"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useUpdate;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var updateReducer = function updateReducer(num) {
  return (num + 1) % 1000000;
};
function useUpdate() {
  var _useReducer = (0, _react.useReducer)(updateReducer, 0),
    _useReducer2 = (0, _slicedToArray2["default"])(_useReducer, 2),
    update = _useReducer2[1];
  return update;
}
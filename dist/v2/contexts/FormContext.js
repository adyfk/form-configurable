"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormContextProvider = exports.FormContext = void 0;
var _react = require("react");
var _ComponentContext = _interopRequireDefault(require("./ComponentContext"));
var _jsxRuntime = require("react/jsx-runtime");
var FormContext = /*#__PURE__*/(0, _react.createContext)({});
exports.FormContext = FormContext;
var FormContextProvider = function FormContextProvider(_ref) {
  var value = _ref.value,
    components = _ref.components,
    children = _ref.children;
  var componentContext = (0, _react.useMemo)(function () {
    return {
      components: components
    };
  }, [components]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(FormContext.Provider, {
    value: value,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ComponentContext["default"].Provider, {
      value: componentContext,
      children: children
    })
  });
};
exports.FormContextProvider = FormContextProvider;
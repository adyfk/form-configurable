"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormContext = void 0;
exports.FormContextProvider = FormContextProvider;
exports.createFormContext = createFormContext;
var _react = _interopRequireWildcard(require("react"));
var _ComponentContext = _interopRequireDefault(require("./ComponentContext"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/* eslint-disable indent */

function createFormContext() {
  return /*#__PURE__*/(0, _react.createContext)({});
}
var FormContext = /*#__PURE__*/(0, _react.createContext)({
  context: {}
});
exports.FormContext = FormContext;
function FormContextProvider(_ref) {
  var Context = _ref.context,
    action = _ref.action,
    children = _ref.children,
    components = _ref.components;
  var contextReference = (0, _react.useMemo)(function () {
    return {
      context: Context
    };
  }, [Context]);
  var componentsValue = (0, _react.useMemo)(function () {
    return {
      components: components
    };
  }, [components]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(FormContext.Provider, {
    value: contextReference,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Context.Provider, {
      value: action,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ComponentContext["default"].Provider, {
        value: componentsValue,
        children: children
      })
    })
  });
}
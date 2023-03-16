"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormSyncReactHookForm = FormSyncReactHookForm;
exports.useSubmitMiddleware = exports.resolverMiddleware = exports["default"] = exports.SumbitMiddlewareContextProvider = exports.SumbitMiddlewareContext = void 0;
exports.withSubmitMiddleware = withSubmitMiddleware;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
var _Fragment2;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var SumbitMiddlewareContext = /*#__PURE__*/(0, _react.createContext)({
  listSubmit: []
});
exports.SumbitMiddlewareContext = SumbitMiddlewareContext;
var SumbitMiddlewareContextProvider = function SumbitMiddlewareContextProvider(_ref) {
  var children = _ref.children,
    order = _ref.order;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    listSubmit = _useState2[0],
    setListSubmit = _useState2[1];
  var addListSubmit = (0, _react.useCallback)(function (callback) {
    setListSubmit(function (prev) {
      return [].concat((0, _toConsumableArray2["default"])(prev), [callback]);
    });
  }, [setListSubmit]);
  var removeListSubmit = (0, _react.useCallback)(function (callback) {
    setListSubmit(function (prev) {
      return prev.filter(function (func) {
        return func !== callback;
      });
    });
  }, [setListSubmit]);
  var validateListSubmit = (0, _react.useCallback)(function () {
    if (!listSubmit.length) return Promise.resolve();
    var listSubmitWrapper = listSubmit.map(
    // eslint-disable-next-line no-promise-executor-return
    function (handleSubmit) {
      return new Promise(function (resolve, reject) {
        return handleSubmit(resolve, reject)({});
      });
    });
    return Promise.race(listSubmitWrapper);
  }, [listSubmit]);
  var submitMiddlewareContextValue = (0, _react.useMemo)(function () {
    return {
      listSubmit: listSubmit,
      addListSubmit: addListSubmit,
      removeListSubmit: removeListSubmit,
      validateListSubmit: validateListSubmit,
      order: order
    };
  }, [listSubmit, order]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(SumbitMiddlewareContext.Provider, {
    value: submitMiddlewareContextValue,
    children: children
  });
};
exports.SumbitMiddlewareContextProvider = SumbitMiddlewareContextProvider;
var useSubmitMiddleware = function useSubmitMiddleware(props) {
  var _useContext = (0, _react.useContext)(SumbitMiddlewareContext),
    addListSubmit = _useContext.addListSubmit,
    removeListSubmit = _useContext.removeListSubmit;
  (0, _react.useEffect)(function () {
    var handleSubmit = props.handleSubmit;
    addListSubmit(handleSubmit);
    return function () {
      return removeListSubmit(handleSubmit);
    };
  }, [props.handleSubmit, addListSubmit, removeListSubmit]);
};
exports.useSubmitMiddleware = useSubmitMiddleware;
function withSubmitMiddleware(Child, config) {
  var displayName = Child.displayName || Child.name || 'Component';
  function Component(props) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(SumbitMiddlewareContextProvider, {
      order: config.order || 'before',
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Child, (0, _extends2["default"])({}, props))
    });
  }
  Component.displayName = "withTheme(".concat(displayName, ")");
  return Component;
}
var resolverMiddleware = function resolverMiddleware(_ref2) {
  var resolver = _ref2.resolver,
    form = _ref2.form;
  return /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(values) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return resolver((0, _extends2["default"])({}, values, {
              parent: form.config.values
            }), {}, {});
          case 3:
            return _context.abrupt("return", _context.sent);
          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", _context.t0);
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 6]]);
    }));
    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
};
exports.resolverMiddleware = resolverMiddleware;
function FormSyncReactHookForm(_ref4) {
  var action = _ref4.action,
    config = _ref4.config,
    form = _ref4.form;
  useSubmitMiddleware({
    handleSubmit: action.handleSubmit
  });
  var value = action.watch();
  (0, _react.useEffect)(function () {
    form.setValue(config.name, value, {
      freeze: true
    });
  }, [value, form, config]);
  return _Fragment2 || (_Fragment2 = /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {}));
}
var _default = useSubmitMiddleware;
exports["default"] = _default;
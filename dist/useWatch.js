"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWatch = exports.initializeWatch = exports["default"] = void 0;
var _react = require("react");
var _useForm = require("./useForm");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./hooks/useUpdate"));
var _get = _interopRequireDefault(require("./utils/get"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var initializeWatch = function initializeWatch(_ref) {
  var values = _ref.values,
    name = _ref.name;
  var data = [];
  var _iterator = _createForOfIteratorHelper(name),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      data.push((0, _get["default"])(values, key));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return data;
};
exports.initializeWatch = initializeWatch;
var useWatch = function useWatch(props) {
  var _useContext = (0, _react.useContext)(_useForm.FormContext),
    formContext = _useContext.form;
  var _props$form = props.form,
    form = _props$form === void 0 ? formContext : _props$form,
    name = props.name;
  var _state = (0, _react.useRef)(initializeWatch({
    values: form.config.values,
    name: name
  }));
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function (values) {
    var latestState = initializeWatch({
      values: values,
      name: name
    });
    if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
      _state.current = latestState;
      update();
    }
  }, [name.length]);
  (0, _useSubscribe["default"])({
    form: form,
    subject: 'state',
    callback: latestState
  });
  return _state.current;
};
exports.useWatch = useWatch;
var _default = useWatch;
exports["default"] = _default;
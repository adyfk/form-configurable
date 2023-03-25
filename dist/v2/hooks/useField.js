"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useField = exports["default"] = void 0;
var _react = require("react");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./useUpdate"));
var _FormContext = require("../contexts/FormContext");
// eslint-disable-next-line no-use-before-define
var useField = function useField(props) {
  var _useContext = (0, _react.useContext)(_FormContext.FormContext),
    formContext = _useContext.form;
  var _ref2 = props,
    _ref2$form = _ref2.form,
    form = _ref2$form === void 0 ? formContext : _ref2$form,
    schema = _ref2.schema;
  var _ref = (0, _react.useRef)();
  var _state = (0, _react.useRef)(form.getSchemaFieldState(schema));
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function () {
    var latestState = _state.current;
    if (JSON.stringify(form.getSchemaFieldState(schema)) !== JSON.stringify(latestState)) {
      _state.current = latestState;
      update();
    }
  }, [schema]);
  (0, _useSubscribe["default"])({
    form: form,
    callback: latestState,
    subject: "fields"
  });
  (0, _react.useEffect)(function () {
    latestState();
  }, [schema]);
  (0, _react.useEffect)(function () {
    form.fieldRef[schema.config.name] = _ref;
    return function () {
      delete form.fieldRef[schema.config.name];
    };
  }, [schema.config.name]);
  return {
    state: _state.current,
    ref: _ref,
    form: form,
    data: schema.config.data || {},
    onChange: (0, _react.useCallback)(function (arg) {
      if (typeof arg === "function") {
        form.setValue(schema.config.name, arg(form.state.values));
      } else {
        form.setValue(schema.config.name, arg);
      }
    }, [schema.config.name, form]),
    onBlur: (0, _react.useCallback)(function () {
      return form.updateTouch(schema.config.name);
    }, [schema.config.name, form])
  };
};
exports.useField = useField;
var _default = useField;
exports["default"] = _default;
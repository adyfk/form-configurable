"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useField = exports.initializeField = exports["default"] = void 0;
var _react = require("react");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useForm = require("./useForm");
var _get = _interopRequireDefault(require("./utils/get"));
var _useUpdate = _interopRequireDefault(require("./hooks/useUpdate"));
var initializeField = function initializeField(_ref2) {
  var values = _ref2.values,
    fields = _ref2.fields,
    props = _ref2.props,
    config = _ref2.config;
  var field = {
    value: (0, _get["default"])(values, config.name),
    error: fields.error[config.name],
    touched: fields.touched[config.name],
    fieldState: {}
  };
  for (var key in props) {
    var _props$key;
    var value = (_props$key = props[key]) == null ? void 0 : _props$key[config.name];
    field.fieldState[key] = typeof value === 'undefined' ? true : value;
  }
  return field;
};
exports.initializeField = initializeField;
var useField = function useField(props) {
  var _useContext = (0, _react.useContext)(_useForm.FormContext),
    formContext = _useContext.form;
  var _props$form = props.form,
    form = _props$form === void 0 ? formContext : _props$form,
    config = props.config,
    log = props.log;
  var formState = form.formState;
  var _ref = (0, _react.useRef)();
  var _state = (0, _react.useRef)(initializeField({
    values: form.config.values,
    fields: form.fields,
    props: form.props,
    config: config
  }));
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function (values, fields, props) {
    var latestState = initializeField({
      values: values,
      fields: fields,
      props: props,
      config: config
    });
    if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
      _state.current = latestState;
      update();
    }
  }, [config]);
  (0, _useSubscribe["default"])({
    form: form,
    callback: latestState,
    subject: 'state'
  });
  (0, _react.useEffect)(function () {
    latestState(form.config.values, form.fields, form.props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);
  (0, _react.useEffect)(function () {
    form.refs[config.name] = _ref;
    return function () {
      delete form.refs[config.name];
    };
  }, [config.name, form.refs]);
  log == null ? void 0 : log(config, _state.current);
  return {
    form: form,
    formState: formState,
    fieldState: _state.current.fieldState,
    ref: _ref,
    value: _state.current.value,
    error: _state.current.error,
    touched: formState.isSubmitted || _state.current.touched,
    onChange: (0, _react.useCallback)(function (arg) {
      if (typeof arg === 'function') {
        form.setValue(config.name, arg(form.config.values));
      } else {
        form.setValue(config.name, arg);
      }
    }, [config.name, form]),
    onBlur: (0, _react.useCallback)(function () {
      return form.updateTouch(config.name);
    }, [config.name, form])
  };
};
exports.useField = useField;
var _default = useField;
exports["default"] = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFieldArray = exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _react = require("react");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./useUpdate"));
var _FormContext = require("../contexts/FormContext");
// eslint-disable-next-line no-use-before-define
var useFieldArray = function useFieldArray(props) {
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
    var _state$value, _latestState$value;
    var latestState = _state.current;
    var state = form.getSchemaFieldState(schema);
    if (JSON.stringify({
      length: (_state$value = state.value) == null ? void 0 : _state$value.length,
      fieldState: state.fieldState,
      propsState: state.propsState,
      error: state.error
    }) !== JSON.stringify({
      length: (_latestState$value = latestState.value) == null ? void 0 : _latestState$value.length,
      fieldState: latestState.fieldState,
      propsState: latestState.propsState,
      error: latestState.error
    })) {
      _state.current = state;
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
    formState: form.state.containerFormState,
    ref: _ref,
    form: form,
    data: schema.config.data || {},
    onPush: (0, _react.useCallback)(function (arg) {
      form.setValue(schema.config.name, [].concat((0, _toConsumableArray2["default"])(form.getValue(schema.config.name)), [arg]));
    }, [schema.config.name, form]),
    onUnshift: (0, _react.useCallback)(function (arg) {
      form.setValue(schema.config.name, [arg].concat((0, _toConsumableArray2["default"])(form.getValue(schema.config.name))));
    }, [schema.config.name, form]),
    onReplace: (0, _react.useCallback)(function (id, arg, callbackId) {
      var values = (0, _toConsumableArray2["default"])(form.getValue(schema.config.name));
      var index = values.findIndex(function (item) {
        return callbackId(item) === id;
      });
      if (index === -1) {
        return;
      }
      values.splice(index, 1, arg);
      form.setValue(schema.config.name, values);
    }, [schema.config.name, form]),
    onDelete: (0, _react.useCallback)(function (id, callbackId) {
      var values = (0, _toConsumableArray2["default"])(form.getValue(schema.config.name));
      var index = values.findIndex(function (item) {
        return callbackId(item) === id;
      });
      if (index === -1) {
        return;
      }
      values.splice(index, 1);
      form.setValue(schema.config.name, values);
    }, [schema.config.name, form]),
    onClear: (0, _react.useCallback)(function () {
      form.setValue(schema.config.name, []);
    }, [schema.config.name, form]),
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
exports.useFieldArray = useFieldArray;
var _default = useFieldArray;
exports["default"] = _default;
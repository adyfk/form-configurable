"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useView = exports.initializeView = exports["default"] = void 0;
var _react = require("react");
var _useForm = require("./useForm");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _get = _interopRequireDefault(require("./utils/get"));
var _useUpdate = _interopRequireDefault(require("./hooks/useUpdate"));
/* eslint-disable no-underscore-dangle */

var initializeView = function initializeView(_ref) {
  var values = _ref.values,
    props = _ref.props,
    config = _ref.config;
  var field = {
    data: undefined,
    viewState: {}
  };
  for (var key in props) {
    var _props$key;
    var value = (_props$key = props[key]) == null ? void 0 : _props$key[config.name || config.key];
    field.viewState[key] = typeof value === 'undefined' ? true : value;
  }
  if (config.name) {
    field.data = (0, _get["default"])(values, config.name);
  }
  return field;
};
exports.initializeView = initializeView;
var useView = function useView(props) {
  var _config$props;
  var _useContext = (0, _react.useContext)(_useForm.FormContext),
    formContext = _useContext.form;
  var _props$form = props.form,
    form = _props$form === void 0 ? formContext : _props$form,
    config = props.config;
  var _state = (0, _react.useRef)(initializeView({
    values: form.config.values,
    props: form.props,
    config: config
  }));
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function (values, _, props) {
    var latestState = initializeView({
      values: values,
      props: props,
      config: config
    });
    if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
      _state.current = latestState;
      update();
    }
  }, [config]);
  (0, _useSubscribe["default"])({
    subject: 'state',
    form: form,
    callback: latestState,
    disabled: !((_config$props = config.props) != null && _config$props.length) && !config.name
  });
  (0, _react.useEffect)(function () {
    latestState(form.config.values, form.fields, form.props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);
  return {
    form: form,
    data: _state.current.data,
    viewState: _state.current.viewState
  };
};
exports.useView = useView;
var _default = useView;
exports["default"] = _default;
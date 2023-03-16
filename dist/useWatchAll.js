"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWatchAll = exports["default"] = void 0;
var _react = require("react");
var _useForm = require("./useForm");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./hooks/useUpdate"));
/* eslint-disable react-hooks/exhaustive-deps */

var useWatchAll = function useWatchAll(props) {
  var _useContext = (0, _react.useContext)(_useForm.FormContext),
    formContext = _useContext.form;
  var _props$form = props.form,
    form = _props$form === void 0 ? formContext : _props$form,
    disabled = props.disabled;
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function () {
    update();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  (0, _useSubscribe["default"])({
    form: form,
    subject: 'state',
    callback: latestState,
    disabled: disabled
  });
  return {
    values: form.config.values,
    formState: form.formState,
    fields: form.fields
  };
};
exports.useWatchAll = useWatchAll;
var _default = useWatchAll;
exports["default"] = _default;
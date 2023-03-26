"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = require("react");
var _FormContext = require("../contexts/FormContext");
var useSubscribe = function useSubscribe(props) {
  var _useContext = (0, _react.useContext)(_FormContext.FormContext),
    context = _useContext.context;
  var _useContext2 = (0, _react.useContext)(context),
    formContext = _useContext2.form;
  var _props$form = props.form,
    form = _props$form === void 0 ? formContext : _props$form,
    callback = props.callback,
    disabled = props.disabled,
    _props$subject = props.subject,
    subject = _props$subject === void 0 ? "fields" : _props$subject;
  (0, _react.useEffect)(function () {
    if (disabled) return;
    var unsubscribe = form.subscribe(subject, callback);
    // eslint-disable-next-line consistent-return
    return unsubscribe;
  }, [disabled, form]);
};
var _default = useSubscribe;
exports["default"] = _default;
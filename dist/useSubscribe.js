"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = require("react");
var _useForm = require("./useForm");
var useSubscribe = function useSubscribe(props) {
  var _useContext = (0, _react.useContext)(_useForm.FormContext),
    formContext = _useContext.form;
  var _props$form = props.form,
    form = _props$form === void 0 ? formContext : _props$form,
    callback = props.callback,
    disabled = props.disabled,
    _props$subject = props.subject,
    subject = _props$subject === void 0 ? 'state' : _props$subject;
  (0, _react.useEffect)(function () {
    if (disabled) return;
    var unsubscribe = form.subscribeWatch(callback, subject);
    // eslint-disable-next-line consistent-return
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, form]);
};
var _default = useSubscribe;
exports["default"] = _default;
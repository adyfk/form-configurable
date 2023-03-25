"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWatch = exports["default"] = void 0;
var _react = require("react");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./useUpdate"));
var _FormContext = require("../contexts/FormContext");
var useWatch = function useWatch(props) {
  var _useContext = (0, _react.useContext)(_FormContext.FormContext),
    formContext = _useContext.form;
  var _ref = props,
    _ref$form = _ref.form,
    form = _ref$form === void 0 ? formContext : _ref$form,
    name = _ref.name;
  var _state = (0, _react.useRef)(props.defaultValue || form.getValue(name));
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function () {
    var latestState = _state.current;
    if (JSON.stringify(form.getValue(name)) !== JSON.stringify(latestState)) {
      _state.current = latestState;
      update();
    }
  }, []);
  (0, _useSubscribe["default"])({
    form: form,
    callback: latestState,
    subject: "fields"
  });
  (0, _react.useEffect)(function () {
    latestState();
  }, []);
  return {
    state: _state.current,
    form: form
  };
};
exports.useWatch = useWatch;
var _default = useWatch;
exports["default"] = _default;
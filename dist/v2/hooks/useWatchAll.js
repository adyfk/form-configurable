"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWatchAll = exports["default"] = void 0;
var _react = require("react");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./useUpdate"));
var _FormContext = require("../contexts/FormContext");
var useWatchAll = function useWatchAll(props) {
  var _useContext = (0, _react.useContext)(_FormContext.FormContext),
    formContext = _useContext.form;
  var _ref = props,
    _ref$form = _ref.form,
    form = _ref$form === void 0 ? formContext : _ref$form;
  var _state = (0, _react.useRef)({});
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function () {
    var latestState = _state.current;
    var values = form.state.values;
    if (JSON.stringify(values) !== JSON.stringify(latestState)) {
      _state.current = values;
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
exports.useWatchAll = useWatchAll;
var _default = useWatchAll;
exports["default"] = _default;
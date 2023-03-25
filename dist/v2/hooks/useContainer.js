"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useContainer = exports["default"] = void 0;
var _react = require("react");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./useUpdate"));
var _createForm = require("../logic/createForm");
var _FormContext = require("../contexts/FormContext");
// import type { ISchema } from "../../types";

var useContainer = function useContainer(props) {
  var _useContext = (0, _react.useContext)(_FormContext.FormContext),
    formContext = _useContext.form;
  var _ref = props,
    _ref$form = _ref.form,
    form = _ref$form === void 0 ? formContext : _ref$form;
  var _state = (0, _react.useRef)(_createForm.initializeState.containerFormState);
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function (state) {
    var latestState = _state.current;
    if (JSON.stringify(state.containerFormState) !== JSON.stringify(latestState)) {
      _state.current = latestState;
      update();
    }
  }, []);
  (0, _useSubscribe["default"])({
    form: form,
    callback: latestState,
    subject: "containers"
  });
  (0, _react.useEffect)(function () {
    latestState(form.state);
  }, []);
  return {
    form: form,
    state: _state.current
  };
};
exports.useContainer = useContainer;
var _default = useContainer;
exports["default"] = _default;
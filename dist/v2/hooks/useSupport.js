"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSupport = exports["default"] = void 0;
var _react = require("react");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./useUpdate"));
var _createForm = require("../logic/createForm");
var _FormContext = require("../contexts/FormContext");
// import type { ISchema } from "../../types";

var useSupport = function useSupport(props) {
  var _useContext = (0, _react.useContext)(_FormContext.FormContext),
    formContext = _useContext.form;
  var _ref = props,
    _ref$form = _ref.form,
    form = _ref$form === void 0 ? formContext : _ref$form;
  var _state = (0, _react.useRef)(_createForm.initializeState.supportFormState);
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function (state) {
    var latestState = _state.current;
    if (JSON.stringify(state.supportFormState) !== JSON.stringify(latestState)) {
      _state.current = latestState;
      update();
    }
  }, []);
  (0, _useSubscribe["default"])({
    form: form,
    callback: latestState,
    subject: "supports"
  });
  (0, _react.useEffect)(function () {
    latestState(form.state);
  }, []);
  return {
    form: form,
    state: _state.current
  };
};
exports.useSupport = useSupport;
var _default = useSupport;
exports["default"] = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useView = exports["default"] = void 0;
var _react = require("react");
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
var _useUpdate = _interopRequireDefault(require("./useUpdate"));
var _FormContext = require("../contexts/FormContext");
var useView = function useView(props) {
  var _useContext = (0, _react.useContext)(_FormContext.FormContext),
    context = _useContext.context;
  var _useContext2 = (0, _react.useContext)(context),
    formContext = _useContext2.form;
  var _ref = props,
    _ref$form = _ref.form,
    form = _ref$form === void 0 ? formContext : _ref$form,
    schema = _ref.schema;
  var _state = (0, _react.useRef)(form.getSchemaViewState(schema));
  var update = (0, _useUpdate["default"])();
  var latestState = (0, _react.useCallback)(function () {
    var latestState = _state.current;
    if (JSON.stringify(form.getSchemaViewState(schema)) !== JSON.stringify(latestState)) {
      _state.current = latestState;
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
  return {
    state: _state.current,
    data: schema.config.data || {},
    form: form
  };
};
exports.useView = useView;
var _default = useView;
exports["default"] = _default;
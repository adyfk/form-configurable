"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useForm = exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _createForm = _interopRequireWildcard(require("../logic/createForm"));
var _useUpdate = _interopRequireDefault(require("./useUpdate"));
var _useSubscribe = _interopRequireDefault(require("./useSubscribe"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var useForm = function useForm(props) {
  var _useState = (0, _react.useState)({
      schemas: props.schemas,
      extraData: props.extraData || {},
      initialValues: props.initialValues || {}
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    config = _useState2[0],
    setConfig = _useState2[1];
  var update = (0, _useUpdate["default"])();
  var _form = (0, _react.useRef)(null);
  var _formState = (0, _react.useRef)(_createForm.initializeState.containerFormState);
  if (!_form.current) {
    _form.current = (0, _createForm["default"])(props);
    _form.current.reset({});
  }
  var latestState = (0, _react.useCallback)(function (state) {
    var latestState = _formState.current;
    if (JSON.stringify(state.containerFormState) !== JSON.stringify(latestState)) {
      _formState.current = latestState;
      update();
    }
  }, []);
  (0, _useSubscribe["default"])({
    form: _form.current,
    callback: latestState,
    subject: "containers"
  });
  (0, _react.useEffect)(function () {
    latestState(_form.current.state);
  }, []);
  (0, _react.useEffect)(function () {
    _form.current.reset({
      schemas: props.schemas,
      extraData: props.extraData,
      initialValues: props.initialValues
    });
    setConfig(_form.current.config);
    _form.current.notify("containers");
    _form.current.notify("fields");
  }, [props.schemas, props.extraData, props.initialValues]);
  return {
    config: config,
    form: _form.current,
    state: _formState.current,
    handleSubmit: _form.current.handleSubmit
  };
};
exports.useForm = useForm;
var _default = useForm;
exports["default"] = _default;
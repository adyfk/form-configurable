"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useForm = exports.initializeRootFormState = exports["default"] = exports.FormContext = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = require("react");
var _createForm = require("./logic/createForm");
var _useSubmitMiddleware = require("./useSubmitMiddleware");
var _useUpdate = _interopRequireDefault(require("./hooks/useUpdate"));
// import useUpdate from './hooks/useUpdate';

var initializeRootFormState = function initializeRootFormState(_ref) {
  var isDirty = _ref.isDirty,
    isSubmitSuccessful = _ref.isSubmitSuccessful,
    isSubmitted = _ref.isSubmitted,
    isValid = _ref.isValid,
    isSubmitting = _ref.isSubmitting,
    isValidating = _ref.isValidating;
  return {
    isDirty: isDirty,
    isSubmitSuccessful: isSubmitSuccessful,
    isSubmitted: isSubmitted,
    isValid: isValid,
    isSubmitting: isSubmitting,
    isValidating: isValidating
  };
};
exports.initializeRootFormState = initializeRootFormState;
var useForm = function useForm(props) {
  var update = (0, _useUpdate["default"])();
  var _useContext = (0, _react.useContext)(_useSubmitMiddleware.SumbitMiddlewareContext),
    validateListSubmit = _useContext.validateListSubmit,
    order = _useContext.order;
  var _form = (0, _react.useRef)(null);
  var _rootFormState = (0, _react.useRef)(null);
  if (!_form.current) {
    _form.current = (0, _extends2["default"])({}, (0, _createForm.createForm)(props));
    _rootFormState.current = initializeRootFormState((0, _extends2["default"])({}, _form.current.formState));
  }
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    schema = _useState2[0],
    setSchema = _useState2[1];
  var getForm = function getForm() {
    return _form.current;
  };
  var handleSubmit = (0, _react.useCallback)(function (onValid, onInvalid) {
    return /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
        var _props$log;
        var form, _props$log2, _props$log3, _props$log4, name, _props$log5, _props$log6;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              (_props$log = props.log) == null ? void 0 : _props$log.call(props, 'handleSubmit triggered');
              event == null ? void 0 : event.stopPropagation();
              event == null ? void 0 : event.preventDefault();
              form = getForm();
              _context.prev = 4;
              form.setFormState({
                isSubmitting: true,
                isSubmitted: true
              });
              if (!(order === 'before')) {
                _context.next = 11;
                break;
              }
              (_props$log2 = props.log) == null ? void 0 : _props$log2.call(props, 'run (before) validate list submit');
              _context.next = 10;
              return validateListSubmit();
            case 10:
              (_props$log3 = props.log) == null ? void 0 : _props$log3.call(props, 'success (before) validate list submit');
            case 11:
              form.executeConfig();
              if (!(form.hasError() && !props.forceSubmitOnError)) {
                _context.next = 17;
                break;
              }
              if (props.shouldFocusError) {
                name = Object.keys(form.fields.error)[0];
                form.setFocus(name);
                (_props$log4 = props.log) == null ? void 0 : _props$log4.call(props, "trigger focus ".concat(name));
              }
              throw new Error('Error Schema');
            case 17:
              _context.next = 19;
              return onValid(form.config.values);
            case 19:
              if (!(order === 'after')) {
                _context.next = 24;
                break;
              }
              (_props$log5 = props.log) == null ? void 0 : _props$log5.call(props, 'run (after) validate list submit');
              _context.next = 23;
              return validateListSubmit();
            case 23:
              (_props$log6 = props.log) == null ? void 0 : _props$log6.call(props, 'success (after) validate list submit');
            case 24:
              form.setFormState({
                isSubmitting: false,
                isSubmitSuccessful: true
              });
              _context.next = 37;
              break;
            case 27:
              _context.prev = 27;
              _context.t0 = _context["catch"](4);
              form.setFormState({
                isSubmitting: false,
                isSubmitSuccessful: false
              });
              _context.prev = 30;
              _context.next = 33;
              return onInvalid == null ? void 0 : onInvalid(form.fields.error, form.config.values, (_context.t0 == null ? void 0 : _context.t0.message) === 'Error Schema' ? 'SCHEMA' : 'CUSTOM');
            case 33:
              _context.next = 37;
              break;
            case 35:
              _context.prev = 35;
              _context.t1 = _context["catch"](30);
            case 37:
              _context.prev = 37;
              form.notifyWatch();
              return _context.finish(37);
            case 40:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[4, 27, 37, 40], [30, 35]]);
      }));
      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();
  }, [props.forceSubmitOnError, order, validateListSubmit]);
  (0, _react.useEffect)(function () {
    var _props$log7;
    if (!_form.current) return;
    (_props$log7 = props.log) == null ? void 0 : _props$log7.call(props, 'useForm - useEffect - (schema, extraData, initialValues)');
    var form = getForm();
    form.reset({
      schema: props.schema,
      extraData: props.extraData,
      initialValues: props.initialValues
    });
    setSchema((0, _toConsumableArray2["default"])(_form.current.config.schema));
    form.setFormState((0, _extends2["default"])({}, _form.current.formState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.schema, props.extraData, props.initialValues]);
  (0, _react.useEffect)(function () {
    var form = getForm();
    var latestState = function latestState(rootFormState) {
      var latestState = initializeRootFormState(rootFormState);
      if (JSON.stringify(_rootFormState.current) !== JSON.stringify(latestState)) {
        _rootFormState.current = latestState;
        update();
      }
    };
    var unsubscribe = form.subscribeWatch(latestState, 'container');
    return unsubscribe;
  }, [schema]);
  return {
    schema: schema,
    get form() {
      return getForm();
    },
    get formState() {
      return _rootFormState.current;
    },
    handleSubmit: handleSubmit
  };
};
exports.useForm = useForm;
var FormContext = /*#__PURE__*/(0, _react.createContext)({});
exports.FormContext = FormContext;
var _default = useForm;
exports["default"] = _default;
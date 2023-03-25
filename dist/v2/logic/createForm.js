"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.getSchemaKey = getSchemaKey;
exports.getSchemaName = getSchemaName;
exports.initializeState = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _lodash = _interopRequireDefault(require("lodash.isequal"));
var _get = _interopRequireDefault(require("../utils/get"));
var _set = _interopRequireDefault(require("../utils/set"));
var _parser = require("../parser");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var initializeState = {
  containerFormState: {
    isSubmitted: false,
    isSubmitSuccessful: false,
    isSubmitting: false,
    isValidating: false
  },
  supportFormState: {
    isValid: true,
    isDirty: false
  },
  propsState: {
    editable: {},
    show: {}
  },
  fieldsState: {
    touched: {}
  },
  fieldsRef: {},
  error: {},
  values: {}
};
exports.initializeState = initializeState;
function getSchemaKey(schema, parent) {
  var _schema$config$name;
  return "".concat(parent ? "".concat(parent, ".") : "").concat((_schema$config$name = schema.config.name) != null ? _schema$config$name : schema.key);
}
function getSchemaName(schema, parent) {
  if (!schema.config.name) return "";
  return "".concat(parent ? "".concat(parent, ".") : "").concat(schema.config.name);
}
var createForm = function createForm(props) {
  var parser = (0, _parser.createParser)(props.formula);
  var _config = {
    schemas: props.schemas,
    extraData: props.extraData || {},
    initialValues: props.initialValues || {}
  };
  var _state = initializeState;
  var _subject = {
    fields: [],
    containers: [],
    supports: []
  };
  var _fieldRef = {};
  var parse = function parse(expression) {
    var terms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return parser.expressionToValue(expression, (0, _extends2["default"])({}, _config.extraData, _state.values, terms));
  };
  function hasError() {
    return !!Object.keys(_state.error).length;
  }
  // values
  function getValue(key) {
    if (!key) return undefined;
    return (0, _get["default"])(_state.values, key);
  }
  function initValue(key, value) {
    (0, _set["default"])(_state.values, key, value);
  }
  // fieldState
  function getError(key) {
    if (!key) return undefined;
    return _state.error[key];
  }
  function getTouch(key) {
    return _state.fieldsState.touched[key];
  }
  function initError(key, value) {
    _state.error[key] = value;
  }
  function initTouched(key, value) {
    _state.fieldsState.touched[key] = value;
  }
  // propsState
  function getProp(name, key) {
    var _state$propsState$nam, _state$propsState$nam2;
    return (_state$propsState$nam = (_state$propsState$nam2 = _state.propsState[name]) == null ? void 0 : _state$propsState$nam2[key]) != null ? _state$propsState$nam : true;
  }
  function initProp(name, key, value) {
    if (!_state.propsState[name]) _state.propsState[name] = {};
    _state.propsState[name][key] = value;
  }
  function getSchemaFieldState(schema) {
    var key = getSchemaKey(schema);
    var propsState = {};
    var fieldState = {};

    // eslint-disable-next-line guard-for-in
    for (var name in _state.propsState) {
      propsState[name] = _state.propsState[name][key];
    }
    // eslint-disable-next-line guard-for-in
    for (var _name in _state.fieldsState) {
      fieldState[_name] = _state.fieldsState[_name][key];
    }
    return {
      value: getValue(key),
      error: getError(key),
      propsState: propsState,
      fieldState: fieldState
    };
  }
  function getSchemaViewState(schema) {
    var key = getSchemaKey(schema);
    var propsState = {};

    // eslint-disable-next-line guard-for-in
    for (var name in _state.propsState) {
      propsState[name] = _state.propsState[name][key];
    }
    return {
      value: getValue(key),
      propsState: propsState
    };
  }
  var subscribe = function subscribe(subject, callback) {
    _subject[subject].push(callback);
    return function () {
      _subject[subject] = _subject[subject].filter(function (fn) {
        return fn !== callback;
      });
    };
  };
  var notify = function notify(subject) {
    var _iterator = _createForOfIteratorHelper(_subject[subject]),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var fn = _step.value;
        fn(_state.values);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var setFocus = function setFocus(key) {
    var _state$fieldsRef$key;
    var field = (_state$fieldsRef$key = _state.fieldsRef[key]) == null ? void 0 : _state$fieldsRef$key.current;
    if (!field) {
      var _props$log;
      (_props$log = props.log) == null ? void 0 : _props$log.call(props, "ref \"".concat(key, "\" field not yet registered"));
      return;
    }
    if (field.focus) {
      field.focus();
    } else {
      var _props$log2;
      (_props$log2 = props.log) == null ? void 0 : _props$log2.call(props, "ref \"".concat(key, "\" focus not yet registered"));
    }
  };
  var setContainerFormState = function setContainerFormState(formStateValue) {
    Object.assign(_state.containerFormState, formStateValue);
  };
  var setSupportFormState = function setSupportFormState(formStateValue) {
    Object.assign(_state.supportFormState, formStateValue);
  };
  var setIsDirty = function setIsDirty() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      skipNotify: true
    };
    if (!_state.supportFormState.isDirty) {
      setSupportFormState({
        isDirty: !(0, _lodash["default"])(props.initialValues, _state.values)
      });
      if (!options.skipNotify) {
        notify("supports");
      }
    }
  };
  var setSupportFormStateValid = function setSupportFormStateValid() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      skipNotify: true
    };
    var isValid = !hasError();
    if (isValid !== _state.supportFormState.isValid) {
      setSupportFormState({
        isValid: isValid
      });
      if (!options.skipNotify) {
        notify("supports");
      }
    }
  };
  var updateTouch = function updateTouch(name) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var shouldRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var isPreviousTouched = getTouch(name);
    initTouched(name, value);
    if (shouldRender && isPreviousTouched !== value) {
      notify("fields");
    }
  };
  function setValue(key, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      skipNotify: false
    };
    initValue(key, value);

    // eslint-disable-next-line no-useless-return
    if (options != null && options.skipNotify) return;
    updateTouch(key, true, false);
    // eslint-disable-next-line no-use-before-define
    executeExpression(key);
    notify("fields");
    setSupportFormStateValid();
    setIsDirty();
  }
  function setValues(values) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      skipNotify: false
    };
    Object.entries(values).forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      initValue(key, value);
    });

    // eslint-disable-next-line no-useless-return
    if (!(options != null && options.skipNotify)) return;
    notify("fields");
    setIsDirty();
  }
  var executeEachOverrideSelfExpression = function executeEachOverrideSelfExpression(schema) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      parent: "",
      extraData: {}
    };
    var key = getSchemaKey(schema, options.parent);
    try {
      initValue(key, parse(schema.overrideSelf, (0, _extends2["default"])({}, options.extraData, {
        __SELF__: getValue(key)
      })));
    } catch (error) {
      //
    }
  };
  var executeEachPropsExpression = function executeEachPropsExpression(schema) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      parent: "",
      extraData: {},
      name: ""
    };
    var updateProps = function updateProps(name, key, configValue, terms) {
      var expressionValue = configValue.expressionValue,
        value = configValue.value;
      try {
        var result = expressionValue ? parse(expressionValue, terms) : value;
        initProp(name, key, result);
      } catch (error) {
        if (value) {
          initProp(name, key, value);
        }
      }
    };
    var _iterator2 = _createForOfIteratorHelper(schema.props),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _step2$value = _step2.value,
          _step2$value$conditio = _step2$value.condition,
          condition = _step2$value$conditio === void 0 ? false : _step2$value$conditio,
          expression = _step2$value.expression,
          name = _step2$value.name,
          value = _step2$value.value,
          expressionValue = _step2$value.expressionValue;
        var _key = getSchemaKey(schema, options.parent);
        var terms = (0, _extends2["default"])({}, options.extraData, {
          __SELF__: getValue(_key)
        });
        if (!expression) {
          updateProps(name, _key, {
            value: value,
            expressionValue: expressionValue
          }, terms);
          continue;
        }
        try {
          var result = parse(expression, terms);
          if (condition === !!result) {
            updateProps(name, _key, {
              value: value,
              expressionValue: expressionValue
            }, terms);
          }
        } catch (error) {
          if (!condition) {
            updateProps(name, _key, {
              value: value,
              expressionValue: expressionValue
            }, terms);
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  };
  var executeEachOverrideExpression = function executeEachOverrideExpression(schema) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      parent: "",
      extraData: {},
      name: ""
    };
    var _iterator3 = _createForOfIteratorHelper(schema.overrides || []),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _step3$value = _step3.value,
          condition = _step3$value.condition,
          expression = _step3$value.expression,
          _values = _step3$value.values;
        if (!expression) {
          setValues((0, _extends2["default"])({}, _values), {
            skipNotify: true
          });
          continue;
        }
        try {
          var result = parse(expression, (0, _extends2["default"])({}, options.extraData));
          if (condition === !!result) {
            setValues((0, _extends2["default"])({}, _values), {
              skipNotify: true
            });
            break;
          }
        } catch (error) {
          if (!condition) {
            setValues((0, _extends2["default"])({}, _values), {
              skipNotify: true
            });
            break;
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  };
  var executeEachRuleExpression = function executeEachRuleExpression(schema) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      parent: "",
      extraData: {}
    };
    var key = getSchemaKey(schema, options.parent);
    var _iterator4 = _createForOfIteratorHelper(schema.rules || []),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _step4$value = _step4.value,
          _step4$value$conditio = _step4$value.condition,
          condition = _step4$value$conditio === void 0 ? false : _step4$value$conditio,
          expression = _step4$value.expression,
          message = _step4$value.message;
        try {
          var result = parse(expression, (0, _extends2["default"])({}, options.extraData, {
            __SELF__: getValue(key)
          }));
          if (condition === !!result) {
            initError(key, message);
            break;
          }
        } catch (error) {
          if (!condition) {
            initError(key, message);
            break;
          }
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  };
  var executeEachArrayExpression = function executeEachArrayExpression(schema) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      parent: "",
      extraData: {}
    };
    if (getError(options.parent)) return;
    var value = getValue(options.parent) || [];
    for (var index = 0; index < value.length; index++) {
      // eslint-disable-next-line no-use-before-define
      executeEachExpression(schema, {
        parent: "".concat(options.parent, ".").concat(index),
        extraData: {
          __INDEX__: index
        }
      });
    }
  };
  var executeEachObjectExpression = function executeEachObjectExpression(schema) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      parent: "",
      extraData: {}
    };
    if (getError(options.parent)) return;

    // eslint-disable-next-line no-use-before-define
    executeEachExpression(schema, {
      parent: "".concat(options.parent)
    });
  };
  var executeEachExpression = function executeEachExpression(schemas) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      parent: "",
      extraData: {}
    };
    if (!schemas) return;
    var _iterator5 = _createForOfIteratorHelper(schemas),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var schema = _step5.value;
        var _key2 = getSchemaKey(schema, options.parent);
        if (schema.variant === "FIELD" || schema.variant === "FIELD-ARRAY" || schema.variant === "FIELD-OBJECT") {
          if (schema.overrideSelf) {
            executeEachOverrideSelfExpression(schema, options);
          }
          if (options.name === _key2) {
            executeEachOverrideExpression(schema, options);
          }
        }
        executeEachPropsExpression(schema);

        // skip when show is false
        if (!getProp("show", _key2) || !getProp("editable", _key2)) continue;
        if (schema.variant === "FIELD") {
          executeEachRuleExpression(schema, options);
          continue;
        }
        if (schema.variant === "FIELD-ARRAY") {
          executeEachRuleExpression(schema, options);
          executeEachArrayExpression(schema.childs, (0, _extends2["default"])({}, options, {
            parent: _key2
          }));
          continue;
        }
        if (schema.variant === "FIELD-OBJECT") {
          executeEachRuleExpression(schema, options);
          executeEachObjectExpression(schema.childs, (0, _extends2["default"])({}, options, {
            parent: _key2
          }));
        }
        if (schema.variant === "GROUP") {
          executeEachExpression(schema.childs, options);
          continue;
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  };
  var executeExpression = function executeExpression(name) {
    _state.error = {};

    // eslint-disable-next-line guard-for-in
    for (var prop in _state.propsState) {
      _state.propsState[prop] = {};
    }
    executeEachExpression(_config.schemas, {
      extraData: {},
      name: name
    });
  };
  var initializeValues = function initializeValues(schemas) {
    var _iterator6 = _createForOfIteratorHelper(schemas),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var schema = _step6.value;
        try {
          if (schema.variant === "FIELD" || schema.variant === "FIELD-ARRAY" || schema.variant === "FIELD-OBJECT") {
            var _key3 = getSchemaKey(schema);
            (0, _set["default"])(_state.values, _key3, (0, _get["default"])(_config.initialValues, _key3) || schema.initialValue);
          } else if (schema.variant === "GROUP") {
            initializeValues(schema.childs);
          }
        } catch (error) {
          var _props$log3;
          (_props$log3 = props.log) == null ? void 0 : _props$log3.call(props, "error on initializeValues", error);
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
  };
  var reset = function reset(_ref3) {
    var _ref3$initialValues = _ref3.initialValues,
      initialValues = _ref3$initialValues === void 0 ? props.initialValues : _ref3$initialValues,
      _ref3$schemas = _ref3.schemas,
      schemas = _ref3$schemas === void 0 ? props.schemas : _ref3$schemas,
      _ref3$extraData = _ref3.extraData,
      extraData = _ref3$extraData === void 0 ? props.extraData : _ref3$extraData;
    // ===
    _config.schemas = schemas || [];
    _config.initialValues = initialValues || {};
    _config.extraData = extraData || {};
    // ===
    Object.assign(_state, initializeState);
    initializeValues(_config.schemas);
    executeExpression();
    setSupportFormStateValid();
    notify("containers");
    notify("fields");
    notify("supports");
  };
  var handleSubmit = function handleSubmit(onValid, onInvalid) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      forceSubmit: false
    };
    return /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
        var _props$log4;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              (_props$log4 = props.log) == null ? void 0 : _props$log4.call(props, "handleSubmit triggered");
              event == null ? void 0 : event.stopPropagation();
              event == null ? void 0 : event.preventDefault();
              _context.prev = 3;
              _state.containerFormState.isSubmitting = true;
              notify("containers");
              executeExpression();
              if (!(hasError() && !options.forceSubmit)) {
                _context.next = 12;
                break;
              }
              _state.containerFormState.isSubmitSuccessful = false;
              onInvalid(_state.values, _state.error, "ON-SCHEMA", _state);
              _context.next = 15;
              break;
            case 12:
              _state.containerFormState.isSubmitSuccessful = true;
              _context.next = 15;
              return onValid(_state.values, _state);
            case 15:
              _context.next = 21;
              break;
            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](3);
              _state.containerFormState.isSubmitSuccessful = false;
              onInvalid(_state.values, _state.error, "ON-SUBMIT", _state);
              //
            case 21:
              _context.prev = 21;
              _state.containerFormState.isSubmitting = false;
              _state.containerFormState.isSubmitted = true;
              notify("containers");
              notify("fields");
              notify("supports");
              return _context.finish(21);
            case 28:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 17, 21, 28]]);
      }));
      return function (_x) {
        return _ref4.apply(this, arguments);
      };
    }();
  };
  reset({});
  return {
    config: _config,
    state: _state,
    subject: _subject,
    fieldRef: _fieldRef,
    setContainerFormState: setContainerFormState,
    setSupportFormState: setSupportFormState,
    getValue: getValue,
    setValue: setValue,
    getError: getError,
    getProp: getProp,
    setValues: setValues,
    setFocus: setFocus,
    handleSubmit: handleSubmit,
    reset: reset,
    getTouch: getTouch,
    subscribe: subscribe,
    notify: notify,
    getSchemaKey: getSchemaKey,
    getSchemaFieldState: getSchemaFieldState,
    getSchemaViewState: getSchemaViewState,
    updateTouch: updateTouch
  };
};
var _default = createForm;
exports["default"] = _default;
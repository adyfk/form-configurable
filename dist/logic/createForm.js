"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.createForm = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _lodash = _interopRequireDefault(require("lodash.isequal"));
var _createPath = _interopRequireDefault(require("../utils/createPath"));
var _parser = require("../parser");
var _set = _interopRequireDefault(require("../utils/set"));
var _get = _interopRequireDefault(require("../utils/get"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var createForm = function createForm(props) {
  var _props$log7;
  var _config = {
    schema: [],
    extraData: {},
    initialValues: {},
    values: {}
  };
  var _props = {
    show: {},
    editable: {}
  };
  var _fields = {
    error: {},
    touched: {}
  };
  var _formState = {
    isSubmitted: false,
    isSubmitSuccessful: false,
    isSubmitting: false,
    isValidating: false,
    isValid: true,
    isDirty: false
  };
  var _refs = {};
  var _subjects = {
    watchs: [],
    watchContainer: []
  };
  function hasError() {
    return !!Object.keys(_fields.error).length;
  }
  function getValue(name) {
    return (0, _get["default"])(_config.values, name);
  }
  function getError(name) {
    return _fields.error[name];
  }
  function getTouch(name) {
    return _fields.touched[name];
  }
  function getProp(name, key) {
    var _props$name;
    var value = (_props$name = _props[name]) == null ? void 0 : _props$name[key];
    return typeof value === 'undefined' || value;
  }
  // function unsetValue(name: string) { unset(_config.values, name); }
  function unsetError(name) {
    delete _fields.error[name];
  }
  // eslint-disable-next-line no-unused-vars
  function unsetTouch(name) {
    delete _fields.touched[name];
  }
  // function unsetProp(name: string, key: string) { delete _props[name][key]; }
  function initValue(name, value) {
    (0, _set["default"])(_config.values, name, value);
  }
  function initError(name, value) {
    _fields.error[name] = value;
  }
  function initTouched(name, value) {
    _fields.touched[name] = value;
  }
  function initProp(name, key, value) {
    if (!_props[name]) _props[name] = {};
    _props[name][key] = value;
  }
  var isPropsSkipExceute = function isPropsSkipExceute(config) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var path = options.path || config.name || config.key;
    var editable = getProp('editable', path);
    var show = getProp('show', path);
    if (!editable) return true;
    if (!show) return true;
    return false;
  };
  var subscribeWatch = function subscribeWatch(callback) {
    var subject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'state';
    if (subject === 'state') {
      _subjects.watchs.push(callback);
      return function () {
        _subjects.watchs = _subjects.watchs.filter(function (fn) {
          return fn !== callback;
        });
      };
    }
    if (subject === 'container') {
      _subjects.watchContainer = _subjects.watchContainer.filter(function (fn) {
        return fn !== callback;
      });
      return function () {
        _subjects.watchContainer.push(callback);
      };
    }
  };
  var notifyWatch = function notifyWatch() {
    var subject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'state';
    if (subject === 'state') {
      var _iterator = _createForOfIteratorHelper(_subjects.watchs),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var fn = _step.value;
          fn(_config.values, _fields, _props);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      var _iterator2 = _createForOfIteratorHelper(_subjects.watchContainer),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _fn = _step2.value;
          _fn(_formState);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  };
  var setFormState = function setFormState(formStateValue) {
    Object.assign(_formState, formStateValue);
    notifyWatch('container');
  };
  var checkFormStateValid = function checkFormStateValid() {
    var isValid = !hasError();
    if (isValid !== _formState.isValid) {
      setFormState({
        isValid: isValid
      });
    }
  };
  var executeExpressionOverride = function executeExpressionOverride(config, name) {
    var _config$override, _config$override3;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var path = options.path || config.name;
    if (typeof name === 'string' && path.includes(name) && (_config$override = config.override) != null && _config$override.others) {
      var _config$override2;
      Object.assign(_config.values, (_config$override2 = config.override) == null ? void 0 : _config$override2.others);
    }
    if ((_config$override3 = config.override) != null && _config$override3.self) {
      try {
        var result = (0, _parser.expressionToValue)(config.override.self, (0, _extends2["default"])({}, _config.values, _config.extraData, options.extraData));
        initValue(path, result);
      } catch (error) {
        //
      }
    }
  };
  var executeExpressionProps = function executeExpressionProps(config) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!config.props) return;
    var path = options.path || config.name || config.key;
    try {
      var _iterator3 = _createForOfIteratorHelper(config.props),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _step3.value,
            expression = _step3$value.expression,
            name = _step3$value.name,
            value = _step3$value.value;
          if (expression) {
            try {
              var isValid = (0, _parser.expressionToValue)(expression, (0, _extends2["default"])({}, _config.values, _config.extraData, options.extraData));
              initProp(name, path, !!isValid);
            } catch (error) {
              initProp(name, path, false);
            }
          } else {
            initProp(name, path, value);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    } catch (error) {
      var _props$log;
      // eslint-disable-next-line no-console
      (_props$log = props.log) == null ? void 0 : _props$log.call(props, 'error on executeExpressionProps', error, {
        info: {
          path: path,
          option: options,
          config: config
        }
      });
    }
  };
  var executeExpressionRule = function executeExpressionRule(config) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!config.rules) return;
    var path = (options == null ? void 0 : options.path) || config.name;
    var _iterator4 = _createForOfIteratorHelper(config.rules),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var rule = _step4.value;
        if (rule["catch"]) {
          try {
            var isTrue = (0, _parser.expressionToValue)(rule.expression, (0, _extends2["default"])({}, _config.values, _config.extraData, options.extraData));
            if (!isTrue) {
              initError(path, rule["catch"]);
              break;
            }
          } catch (e) {
            initError(path, rule["catch"]);
          }
        } else {
          try {
            var _isTrue = (0, _parser.expressionToValue)(rule.expression, (0, _extends2["default"])({}, _config.values, _config.extraData, options.extraData));
            if (_isTrue) {
              initError(path, rule.error);
              break;
            }
          } catch (e) {
            //
          }
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  };

  // eslint-disable-next-line no-unused-vars
  var executeExpressionEachArray = function executeExpressionEachArray(config) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var path = (options.parent ? "".concat(options.parent, ".") : '') + (options.name || config.name);
    var hasError = getError(path);
    if (hasError) return;
    var value = getValue(path) || [];
    for (var index = 0; index < value.length; index++) {
      var _iterator5 = _createForOfIteratorHelper(config.child),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var childConfig = _step5.value;
          var eachOptions = {
            path: (0, _createPath["default"])({
              parent: path,
              index: index,
              child: childConfig.name || childConfig.key
            }),
            extraData: {
              __INDEX__: index,
              __SELF__: getValue("".concat(path, "[").concat(index, "]"))
            }
          };
          if (childConfig.variant === 'FIELD') {
            executeExpressionOverride(childConfig, options.name, eachOptions);
            executeExpressionProps(childConfig, eachOptions);
            if (isPropsSkipExceute(childConfig, eachOptions)) {
              continue;
            }
            if (!options.skipValidate) {
              executeExpressionRule(childConfig, eachOptions);
            }
          } else if (childConfig.variant === 'GROUP') {
            //
          } else {
            executeExpressionProps(childConfig, eachOptions);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  };
  var executeEachConfig = function executeEachConfig(schema, name) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      skipValidate: false
    };
    try {
      var _iterator6 = _createForOfIteratorHelper(schema),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var config = _step6.value;
          if (config.variant === 'FIELD') {
            executeExpressionOverride(config, name);
            executeExpressionProps(config);
            if (isPropsSkipExceute(config)) continue;
            if (!options.skipValidate) {
              executeExpressionRule(config);
            }
            if (config.fieldType === 'ARRAY') {
              executeExpressionEachArray(config, {
                name: config.name,
                skipValidate: options.skipValidate
              });
            } else if (config.fieldType === 'OBJECT') {
              //
            }
          } else if (config.variant === 'GROUP') {
            executeExpressionProps(config);
            if (isPropsSkipExceute(config)) {
              continue;
            }
            executeEachConfig(config.child, name, options);
          } else {
            executeExpressionProps(config);
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    } catch (error) {
      var _props$log2;
      // eslint-disable-next-line no-console
      (_props$log2 = props.log) == null ? void 0 : _props$log2.call(props, 'error on executeEachConfig', error);
    }
  };
  var setIsDirty = function setIsDirty() {
    if (!_formState.isDirty) {
      setFormState({
        isDirty: !(0, _lodash["default"])(props.initialValues, _config.values)
      });
      notifyWatch('container');
    }
  };
  var executeConfig = function executeConfig(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      skipValidate: false
    };
    _fields.error = {};
    _props.editable = {};
    _props.show = {};
    executeEachConfig(_config.schema, name, options);
  };
  var updateTouch = function updateTouch(name) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var shouldRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var isPreviousTouched = getTouch(name);
    initTouched(name, value);
    if (shouldRender && isPreviousTouched !== value) {
      notifyWatch();
    }
  };
  var setValue = function setValue(name, value, options) {
    initValue(name, value);
    if (options != null && options.freeze) return;
    updateTouch(name, true, false);
    executeConfig(name);
    notifyWatch();
    // setIsDirty();
    checkFormStateValid();
  };
  function setValues(values, options) {
    Object.entries(values).forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      initValue(key, value);
    });
    if (options != null && options.freeze) return;
    executeConfig();
    notifyWatch();
    setIsDirty();
    checkFormStateValid();
  }
  function setError(name, value, options) {
    if (value) initError(name, value);else unsetError(name);
    if (options != null && options.freeze) return;
    notifyWatch();
  }
  var setErrors = function setErrors(values, options) {
    Object.entries(values).forEach(function (_ref3) {
      var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];
      initError(key, value);
    });
    if (options != null && options.freeze) return;
    notifyWatch();
  };
  var setFocus = function setFocus(name) {
    var _refs$name, _field$focus, _field$select;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var field = (_refs$name = _refs[name]) == null ? void 0 : _refs$name.current;
    if (!field) return;
    (_field$focus = field.focus) == null ? void 0 : _field$focus.call(field);
    // eslint-disable-next-line no-unused-expressions
    options.shouldSelect && ((_field$select = field.select) == null ? void 0 : _field$select.call(field));
  };
  var initializeValues = function initializeValues(schema) {
    try {
      var _iterator7 = _createForOfIteratorHelper(schema),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var config = _step7.value;
          if (config.variant === 'FIELD') {
            (0, _set["default"])(_config.values, config.name, (0, _get["default"])(_config.initialValues, config.name) || config.initialValue);
          } else if (config.variant === 'GROUP') {
            initializeValues(config.child);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    } catch (error) {
      var _props$log3;
      (_props$log3 = props.log) == null ? void 0 : _props$log3.call(props, 'error on initializeValues', error);
    }
  };

  // initialize default values
  var initialize = function initialize() {
    var _props$log4, _props$log5;
    var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (_props$log4 = props.log) == null ? void 0 : _props$log4.call(props, 'initialize arg', arg);
    (_props$log5 = props.log) == null ? void 0 : _props$log5.call(props, 'initialize props', props);
    try {
      _fields.error = {};
      _fields.touched = {};
      Object.assign(_formState, {
        isSubmitSuccessful: false,
        isSubmitted: false,
        isSubmitting: false,
        isValidating: false
      });
      _config.schema = arg.schema || props.schema || [];
      _config.extraData = arg.extraData || props.extraData || {};
      _config.initialValues = arg.initialValues || props.initialValues || {};
      _config.values = (0, _extends2["default"])({}, _config.initialValues);
      initializeValues(_config.schema);
      executeConfig();
      notifyWatch('container');
      notifyWatch('state');
      checkFormStateValid();
    } catch (error) {
      var _props$log6;
      (_props$log6 = props.log) == null ? void 0 : _props$log6.call(props, 'error on initialize', error);
    }
  };
  var reset = initialize;
  initialize();
  (_props$log7 = props.log) == null ? void 0 : _props$log7.call(props, 'createForm');
  return {
    config: _config,
    props: _props,
    fields: _fields,
    refs: _refs,
    formState: _formState,
    subjects: _subjects,
    hasError: hasError,
    subscribeWatch: subscribeWatch,
    notifyWatch: notifyWatch,
    updateTouch: updateTouch,
    getValue: getValue,
    getError: getError,
    getTouch: getTouch,
    setValue: setValue,
    setValues: setValues,
    setError: setError,
    setErrors: setErrors,
    setFormState: setFormState,
    executeConfig: executeConfig,
    setFocus: setFocus,
    reset: reset
  };
};
exports.createForm = createForm;
var _default = createForm;
exports["default"] = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormContainer = FormContainer;
exports.mapConfigChildArray = exports["default"] = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _createPath = _interopRequireDefault(require("./utils/createPath"));
var _generateId = _interopRequireDefault(require("./utils/generateId"));
var _jsxRuntime = require("react/jsx-runtime");
var _excluded = ["form", "schema", "Group", "View", "Field", "FieldArray"];
var mapConfigChildArray = function mapConfigChildArray(_ref) {
  var config = _ref.config,
    index = _ref.index;
  return config.child.map(function (childConfig) {
    var childConfigOverride = (0, _extends2["default"])({}, childConfig);
    Object.assign(childConfigOverride, {
      key: "".concat(childConfigOverride.key, "_").concat(index)
    });
    if (childConfigOverride.variant === 'FIELD') {
      var _childConfigOverride$, _childConfigOverride$2;
      Object.assign(childConfigOverride, {
        name: (0, _createPath["default"])({
          parent: config.name,
          index: index,
          child: childConfig.name
        }),
        meta: (0, _extends2["default"])({}, childConfigOverride.meta, {
          label: (_childConfigOverride$ = childConfigOverride.meta) == null ? void 0 : (_childConfigOverride$2 = _childConfigOverride$.label) == null ? void 0 : _childConfigOverride$2.replace('__ITEM__', "".concat(+index + 1))
        })
      });
    }
    if (childConfigOverride.variant === 'GROUP') {
      Object.assign(childConfigOverride, {
        child: mapConfigChildArray({
          config: config,
          index: index
        })
      });
    }
    return childConfigOverride;
  });
};
exports.mapConfigChildArray = mapConfigChildArray;
function FormContainer(_ref2) {
  var form = _ref2.form,
    schema = _ref2.schema,
    Group = _ref2.Group,
    View = _ref2.View,
    Field = _ref2.Field,
    FieldArray = _ref2.FieldArray,
    otherProps = (0, _objectWithoutProperties2["default"])(_ref2, _excluded);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: schema.map(function (config) {
      var key = config.variant + (config.name || config.key || (0, _generateId["default"])());
      if (config.variant === 'GROUP') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(Group, (0, _extends2["default"])({
          form: form,
          config: config,
          child: function child(props) {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)(FormContainer, (0, _extends2["default"])({
              Group: Group,
              View: View,
              Field: Field,
              FieldArray: FieldArray,
              schema: config.child,
              form: form
            }, otherProps, props));
          }
        }, otherProps), key);
      }
      if (config.variant === 'VIEW') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(View, (0, _extends2["default"])({
          form: form,
          config: config
        }, otherProps), key);
      }
      if (config.variant === 'FIELD') {
        if (config.fieldType === 'ARRAY' && !!FieldArray) {
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(FieldArray, {
            form: form,
            config: config,
            child: function child(_ref3) {
              var value = _ref3.value,
                Container = _ref3.container;
              return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
                children: value.map(function (data, index) {
                  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Container, {
                    item: index,
                    data: data,
                    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(FormContainer, (0, _extends2["default"])({
                      Group: Group,
                      View: View,
                      Field: Field,
                      FieldArray: FieldArray,
                      schema: mapConfigChildArray({
                        config: config,
                        index: index
                      }),
                      form: form
                    }, otherProps))
                  }, key + index);
                })
              });
            }
          }, key);
        }
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(Field, (0, _extends2["default"])({
          form: form,
          config: config
        }, otherProps), key);
      }
    })
  });
}
var _default = FormContainer;
exports["default"] = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormGenerator = FormGenerator;
exports.SchemaComponent = SchemaComponent;
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = require("react");
var _ComponentContext = _interopRequireDefault(require("../contexts/ComponentContext"));
var _createForm = require("../logic/createForm");
var _set = _interopRequireDefault(require("../utils/set"));
var _contexts = require("../contexts");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-use-before-define */
/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-key */

var updateSchemaConfigName = function updateSchemaConfigName(schema, key) {
  if (!key) return schema;
  (0, _set["default"])(schema, "config.name", key);
  return schema;
};
var updateSchemasAttributTitle = function updateSchemasAttributTitle(schemas, index) {
  return schemas.map(function (schema) {
    var _overrideSchema$attri;
    var overrideSchema = (0, _extends2["default"])({}, schema);
    if (overrideSchema != null && (_overrideSchema$attri = overrideSchema.attribute) != null && _overrideSchema$attri.title) {
      overrideSchema.attribute = (0, _extends2["default"])({}, overrideSchema.attribute, {
        title: overrideSchema.attribute.title.replace("__ITEM__", "".concat(+index + 1))
      });
    }
    return overrideSchema;
  });
};
function SchemaComponent(_ref) {
  var schemas = _ref.schemas,
    schema = _ref.schema,
    parent = _ref.parent,
    fallback = _ref.fallback,
    fallbackVariantNotRegistered = _ref.fallbackVariantNotRegistered,
    fallbackComponentNotRegisterd = _ref.fallbackComponentNotRegisterd;
  var _useContext = (0, _react.useContext)(_ComponentContext["default"]),
    components = _useContext.components;
  var identity = (0, _createForm.getSchemaName)(schema, parent);
  if (schema.variant === "FIELD") {
    var Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_react.Suspense, {
      fallback: fallback,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Component, {
        schema: updateSchemaConfigName(schema, identity)
      })
    });
  }
  if (schema.variant === "VIEW") {
    var _Component = components[schema.variant][schema.component];
    if (!_Component) return fallbackComponentNotRegisterd;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_react.Suspense, {
      fallback: fallback,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Component, {
        schema: updateSchemaConfigName(schema, identity)
      })
    });
  }
  if (schema.variant === "GROUP") {
    var _Component2 = components[schema.variant][schema.component];
    if (!_Component2) return fallbackComponentNotRegisterd;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_react.Suspense, {
      fallback: fallback,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Component2, {
        schema: schema,
        schemas: schemas,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(FormGenerator, {
          parent: parent,
          schemas: schemas,
          fallback: fallback,
          fallbackComponentNotRegisterd: fallbackComponentNotRegisterd,
          fallbackVariantNotRegistered: fallbackVariantNotRegistered
        })
      })
    });
  }
  if (schema.variant === "FIELD-ARRAY") {
    var _Component3 = components[schema.variant][schema.component];
    if (!_Component3) return fallbackComponentNotRegisterd;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_react.Suspense, {
      fallback: fallback,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Component3, {
        schema: schema,
        schemas: schemas,
        children: function children(_ref2) {
          var value = _ref2.value,
            Container = _ref2.container;
          return value.map(function (data, index) {
            return (
              /*#__PURE__*/
              // eslint-disable-next-line react/no-array-index-key
              (0, _jsxRuntime.jsx)(Container, {
                data: data,
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)(FormGenerator, {
                  parent: "".concat(identity, ".").concat(index),
                  schemas: updateSchemasAttributTitle(schemas, index),
                  fallback: fallback,
                  fallbackComponentNotRegisterd: fallbackComponentNotRegisterd,
                  fallbackVariantNotRegistered: fallbackVariantNotRegistered
                })
              }, "".concat(identity, "-").concat(index))
            );
          });
        }
      })
    });
  }
  if (schema.variant === "FIELD-OBJECT") {
    var _Component4 = components[schema.variant][schema.component];
    if (!_Component4) return fallbackComponentNotRegisterd;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_react.Suspense, {
      fallback: fallback,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Component4, {
        schema: schema,
        schemas: schemas,
        children: function children(_ref3) {
          var value = _ref3.value,
            Container = _ref3.container;
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(Container, {
            data: value,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(FormGenerator, {
              parent: "".concat(identity),
              schemas: schemas,
              fallback: fallback,
              fallbackComponentNotRegisterd: fallbackComponentNotRegisterd,
              fallbackVariantNotRegistered: fallbackVariantNotRegistered
            })
          }, "".concat(identity));
        }
      })
    });
  }
  return fallbackVariantNotRegistered;
}
function FormGenerator(props) {
  var _useContext2 = (0, _react.useContext)(_contexts.FormContext),
    formContext = _useContext2.form;
  var _props$schemas = props.schemas,
    schemas = _props$schemas === void 0 ? formContext.config.schemas : _props$schemas,
    _props$parent = props.parent,
    parent = _props$parent === void 0 ? "" : _props$parent,
    _props$fallback = props.fallback,
    fallback = _props$fallback === void 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {}) : _props$fallback,
    _props$fallbackVarian = props.fallbackVariantNotRegistered,
    fallbackVariantNotRegistered = _props$fallbackVarian === void 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {}) : _props$fallbackVarian,
    _props$fallbackCompon = props.fallbackComponentNotRegisterd,
    fallbackComponentNotRegisterd = _props$fallbackCompon === void 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {}) : _props$fallbackCompon;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: schemas.map(function (schema) {
      var identity = (0, _createForm.getSchemaKey)(schema, parent);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(SchemaComponent, {
        parent: parent,
        schema: schema,
        schemas: schemas,
        fallback: fallback,
        fallbackComponentNotRegisterd: fallbackComponentNotRegisterd,
        fallbackVariantNotRegistered: fallbackVariantNotRegistered
      }, identity);
    })
  });
}
var _default = FormGenerator;
exports["default"] = _default;
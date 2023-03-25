"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = require("react");
var _ComponentContext = _interopRequireDefault(require("../contexts/ComponentContext"));
var _createForm = require("../logic/createForm");
var _set = _interopRequireDefault(require("../utils/set"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-use-before-define */
/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-key */

function ComponentNotRegistered(_ref) {
  var schema = _ref.schema;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: ["Component \"", schema.component, "\" not registered"]
  });
}
var updateSchemaConfigName = function updateSchemaConfigName(schema, key) {
  if (!key) return schema;
  (0, _set["default"])(schema, "config.name", key);
  return schema;
};
function SchemaComponent(_ref2) {
  var schemas = _ref2.schemas,
    schema = _ref2.schema,
    parent = _ref2.parent;
  var _useContext = (0, _react.useContext)(_ComponentContext["default"]),
    components = _useContext.components;
  var identity = (0, _createForm.getSchemaName)(schema, parent);
  if (schema.variant === "FIELD") {
    var Component = components[schema.variant][schema.component] || ComponentNotRegistered;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(Component, {
      schema: updateSchemaConfigName(schema, identity)
    });
  }
  if (schema.variant === "VIEW") {
    var _Component = components[schema.variant][schema.component] || ComponentNotRegistered;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Component, {
      schema: updateSchemaConfigName(schema, identity)
    });
  }
  if (schema.variant === "GROUP") {
    var _Component2 = components[schema.variant][schema.component] || ComponentNotRegistered;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Component2, {
      schema: schema,
      schemas: schemas,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(FormGenerator, {
        parent: parent,
        schemas: schemas
      })
    });
  }
  if (schema.variant === "FIELD-ARRAY") {
    var _Component3 = components[schema.variant][schema.component] || ComponentNotRegistered;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Component3, {
      schema: schema,
      schemas: schemas,
      children: function children(_ref3) {
        var value = _ref3.value,
          Container = _ref3.container;
        return value.map(function (data, index) {
          return (
            /*#__PURE__*/
            // eslint-disable-next-line react/no-array-index-key
            (0, _jsxRuntime.jsx)(Container, {
              data: data,
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(FormGenerator, {
                parent: "".concat(identity, ".").concat(index),
                schemas: schemas
              })
            }, "".concat(identity, "-").concat(index))
          );
        });
      }
    });
  }
  if (schema.variant === "FIELD-OBJECT") {
    var _Component4 = components[schema.variant][schema.component] || ComponentNotRegistered;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Component4, {
      schema: schema,
      schemas: schemas,
      children: function children(_ref4) {
        var value = _ref4.value,
          Container = _ref4.container;
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(Container, {
          data: value,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(FormGenerator, {
            parent: "".concat(identity),
            schemas: schemas
          })
        }, "".concat(identity));
      }
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: ["variant `", schema.variant, "` not registered"]
  });
}
function FormGenerator(_ref5) {
  var schemas = _ref5.schemas,
    _ref5$parent = _ref5.parent,
    parent = _ref5$parent === void 0 ? "" : _ref5$parent;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: schemas.map(function (schema) {
      var identity = (0, _createForm.getSchemaKey)(schema, parent);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(SchemaComponent, {
        parent: parent,
        schema: schema,
        schemas: schemas
      }, identity);
    })
  });
}
var _default = FormGenerator;
exports["default"] = _default;
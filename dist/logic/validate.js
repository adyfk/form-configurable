"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _createForm = _interopRequireDefault(require("./createForm"));
var validate = function validate(schema, data, extraData) {
  var form = (0, _createForm["default"])({
    schema: schema
  });
  form.setValues((0, _extends2["default"])({}, data, extraData));
  return form.fields.error;
};
exports.validate = validate;
var _default = validate;
exports["default"] = _default;
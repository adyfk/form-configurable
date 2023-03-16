"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var transform = {
  STRING: function STRING(value) {
    return value || '';
  },
  NUMBER: function NUMBER(value) {
    var result = parseInt(value);
    return result || 0;
  }
};
exports.transform = transform;
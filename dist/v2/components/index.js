"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _FormGenerator = require("./FormGenerator");
Object.keys(_FormGenerator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _FormGenerator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _FormGenerator[key];
    }
  });
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = exports.registerPropertyEditor = undefined;

var _model = require("../model");

var editors = {};

var registerPropertyEditor = exports.registerPropertyEditor = function registerPropertyEditor(type, editor) {
  if (!type || !editor) {
    throw new Error("invalid argument");
  }

  if (editors[type]) {
    throw new Error("multiple property editors not supported");
  }
  editors[type] = editor;
};

var Editor = exports.Editor = function Editor(props) {
  var spec = props.spec;

  if (!spec || !spec.type) {
    console.warn('no spec found in the obj');
    return null;
  }
  if (!editors[spec.type]) {
    console.log('no property editor found for ' + spec.type);
    return null;
  }
  return editors[spec.type](props, _model.editSpec);
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRender = registerRender;
exports.WrapList = WrapList;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import ItemTypes from '../constants'
// import Input from '../components/input'

var renders = {};

function registerRender(type, render) {
  if (!type || !render) {
    throw new Error("invalid argument");
  }
  if (renders[type]) {
    throw new Error("can't register multiple renders for the same type: " + type);
  }
  renders[type] = render;
}

function renderChild(child) {
  if (!child || !child.type) {
    return null;
  }
  if (!renders[child.type]) {
    return null;
  }
  // console.log('will render child (' + child.type + ')')
  return renders[child.type](child);
}

function WrapList(List) {
  return function (props) {
    var spec = props.spec;
    var children = spec.children;
    // console.log('WrapList render children (' + length(children) + ') children')

    return _react2.default.createElement(
      List,
      { spec: spec },
      children && children.map(function (child) {
        return renderChild(child);
      })
    );
  };
}

function Workspace(_ref) {
  var children = _ref.children;

  return _react2.default.createElement(
    "div",
    null,
    children
  );
}

exports.default = WrapList(Workspace);
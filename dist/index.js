'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginWidgets = exports.pluginDropElementRenders = exports.pluginElementPropertyEditoros = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dnd = require('./dnd');

var _reactDnd = require('react-dnd');

var _reactDndHtml5Backend = require('react-dnd-html5-backend');

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

require('./index.scss');

var _model = require('./model');

var _antd = require('antd');

var _workspace = require('./workspace');

var _workspace2 = _interopRequireDefault(_workspace);

var _property = require('./property');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import ItemTypes from '../constants'


var widgets = [];

function defaultLayout(workspace, sidebar) {
  return _react2.default.createElement(
    'div',
    { className: 'stage' },
    _react2.default.createElement(
      'div',
      { className: 'workspace' },
      workspace
    ),
    _react2.default.createElement(
      'div',
      { className: 'sidebar' },
      sidebar
    )
  );
}

function Sidebar(_ref) {
  var model = _ref.model;

  return _react2.default.createElement(
    _antd.Tabs,
    { activeKey: model.activeTabKey, onChange: _model.changeTabKey },
    _react2.default.createElement(
      _antd.Tabs.TabPane,
      { tab: 'Widgets', key: 'widgets-tab' },
      widgets && widgets() || null
    ),
    _react2.default.createElement(
      _antd.Tabs.TabPane,
      { tab: 'Property', key: 'property-tab' },
      model.editingSpec ? _react2.default.createElement(_property.Editor, { spec: model.editingSpec }) : "Property"
    )
  );
}

function Stage(_ref2) {
  var dndItemTypes = _ref2.dndItemTypes,
      model = _ref2.model,
      layout = _ref2.layout;

  var WS = (0, _dnd.makeDropable)(dndItemTypes, _workspace2.default);

  if (!layout) {
    layout = defaultLayout;
  }

  return layout(_react2.default.createElement(WS, { spec: model.rootSpec }), _react2.default.createElement(Sidebar, { model: model }));
}

var ModelStage = function (_React$Component) {
  _inherits(ModelStage, _React$Component);

  function ModelStage(props) {
    _classCallCheck(this, ModelStage);

    var _this = _possibleConstructorReturn(this, (ModelStage.__proto__ || Object.getPrototypeOf(ModelStage)).call(this, props));

    _this.state = {
      model: (0, _model.getCurrentModel)(props.spec)
    };
    return _this;
  }

  _createClass(ModelStage, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var changeNotifier = function changeNotifier() {};
      if (this.props.onSpecChange) {
        changeNotifier = this.props.onSpecChange;
      }

      this.unObserve = (0, _model.observe)(function (model) {
        _this2.setState(model);
        changeNotifier(_extends({}, model.rootSpec));
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unObserve) {
        this.unObserve();
        this.unObserve = null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var dndItemTypes = this.props.dndItemTypes || ['INPUT', 'LIST'];
      return _react2.default.createElement(Stage, { model: this.state.model, dndItemTypes: dndItemTypes, layout: this.props.layout });
    }
  }]);

  return ModelStage;
}(_react2.default.Component);

var pluginElementPropertyEditoros = exports.pluginElementPropertyEditoros = function pluginElementPropertyEditoros(fn) {
  fn(_property.registerPropertyEditor);
};

var pluginDropElementRenders = exports.pluginDropElementRenders = function pluginDropElementRenders(fn) {
  fn(_workspace.registerRender, _dnd.makeDropElement, _dnd.makeDropList);
};

var pluginWidgets = exports.pluginWidgets = function pluginWidgets(fn) {
  var res = fn(_dnd.makeDragable);
  if (!res) {
    throw new Error("need widgets");
  }
  widgets = res;
};

exports.default = (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(ModelStage);
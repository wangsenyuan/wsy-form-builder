'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeDropList = exports.makeDropElement = exports.Workspace = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import ListEl from '../../components/list'


exports.makeDragable = makeDragable;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require('react-dnd');

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _antd = require('antd');

var _workspace = require('../workspace');

var _workspace2 = _interopRequireDefault(_workspace);

require('./index.scss');

var _model = require('../model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function dropDropable(types) {
  return function (Elem, props) {
    // console.log('dropDropable called')
    var Res = makeDropable(types, Elem);
    return _react2.default.createElement(Res, _extends({ dropable: true }, props));
  };
}

function droppedElem(Elem, drop) {
  return function (props) {
    var className = "dropped";
    if (drop) {
      className += " droppable";
    }
    return _react2.default.createElement(
      'div',
      { className: className },
      !drop ? _react2.default.createElement(Elem, props) : drop(Elem, props),
      _react2.default.createElement(_antd.Icon, { type: 'edit', onClick: function onClick() {
          return (0, _model.startEditingSpec)(props.spec);
        } }),
      _react2.default.createElement(_antd.Icon, { type: 'delete', onClick: function onClick() {
          return (0, _model.removeSpec)(props.spec);
        } }),
      _react2.default.createElement(_antd.Icon, { type: 'up', onClick: function onClick() {
          return (0, _model.upSpec)(props.spec);
        } }),
      _react2.default.createElement(_antd.Icon, { type: 'down', onClick: function onClick() {
          return (0, _model.downSpec)(props.spec);
        } })
    );
  };
}

function makeDropable(types, Elem) {
  var dropTarget = {
    canDrop: function canDrop(props, monitor) {
      // console.log('check canDrop: ' + JSON.stringify(props))
      // console.log('workspace canDrop called: ' + JSON.stringify(props))
      // should determine by the type of target
      var ret = props && props.spec && props.spec.leaf === false && !monitor.didDrop();
      // console.log('test canDrop => ' + ret)
      return ret;
    },
    drop: function drop(props, monitor) {
      if (monitor.didDrop()) {
        // console.log('has already dropped on child target')
        return;
      }
      // console.log('drop here (' + JSON.stringify(props.spec) + ')')
      //should update the spec
      var parentSpec = props.spec;
      // let item = monitor.getItem()
      // let childSpec = (item && item.spec && { ...item.spec }) || {}
      return { parentSpec: parentSpec };
    }
  };

  function collect(connect) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  }

  function DropableElement(props) {
    var connectDropTarget = props.connectDropTarget,
        rest = _objectWithoutProperties(props, ['connectDropTarget']);

    return connectDropTarget(_react2.default.createElement(
      'div',
      { className: 'dropable-container', style: { position: 'relative', width: '100%', height: '100%' } },
      _react2.default.createElement(Elem, rest)
    ));
  }
  return (0, _reactDnd.DropTarget)(types, dropTarget, collect)(DropableElement);
}

function makeDragable(name, type) {
  var elemSource = {
    beginDrag: function beginDrag(_ref) {
      var spec = _ref.spec;

      return { spec: spec };
    },
    endDrag: function endDrag(props, monitor) {
      if (!monitor.didDrop()) {
        return;
      }

      var _monitor$getDropResul = monitor.getDropResult(),
          parentSpec = _monitor$getDropResul.parentSpec;

      (0, _model.addSpec)(parentSpec, props.spec);
    }
  };

  function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  }

  function DraggleElement(props) {
    var connectDragSource = props.connectDragSource;


    return connectDragSource(_react2.default.createElement(
      'div',
      { style: { width: '100%', cursor: "pointer" } },
      _react2.default.createElement(
        'span',
        null,
        name
      )
    ));
  }

  return (0, _reactDnd.DragSource)(type, elemSource, collect)(DraggleElement);
}

// export const DroppedInput = droppedElem(InputEl)
// export const DroppedList = droppedElem(WrapList(ListEl), dropDropable(ItemTypes.Input))
// export const Input = makeDragable("输入框", ItemTypes.Input)
// export const List = makeDragable("列表", ItemTypes.Input)
var Workspace = exports.Workspace = makeDropable([_constants2.default.Input, _constants2.default.List], _workspace2.default);
var makeDropElement = exports.makeDropElement = droppedElem;
var makeDropList = exports.makeDropList = function makeDropList(acceptType, Elem) {
  return droppedElem((0, _workspace.WrapList)(Elem), dropDropable(acceptType));
};
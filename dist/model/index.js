'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSpec = exports.changeTabKey = exports.editSpec = exports.startEditingSpec = exports.getCurrentModel = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.observe = observe;
exports.addSpec = addSpec;
exports.upSpec = upSpec;
exports.downSpec = downSpec;

var _randomString = require('random-string');

var _randomString2 = _interopRequireDefault(_randomString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var observers = [];

function nextKey() {
  return (0, _randomString2.default)({ length: 20 });
}

var model = {
  rootSpec: {
    children: [],
    leaf: false,
    key: nextKey()
  },
  activeTabKey: "widgets-tab",
  editingSpec: null
};

function emitChange() {
  if (observers) {
    for (var i = 0; i < observers.length; i++) {
      observers[i](model);
    }
  }
}

function observe(o) {
  observers.push(o);
  emitChange();
  return function () {
    observers = observers.filter(function (x) {
      return x !== o;
    });
  };
}

function addSpec(parentSpec, childSpec) {
  console.log('addChild called');
  function loop(cur) {
    if (cur.key === parentSpec.key) {
      if (!cur.children) {
        cur.children = [];
      }

      var obj = _extends({}, childSpec);
      obj.key = nextKey();
      // obj.config = { ...childSpec.config }

      cur.children.push(obj);
    } else if (cur.children) {
      cur.children = cur.children.map(function (item) {
        return loop(item);
      });
    }
    return cur;
  }
  model.rootSpec = loop(_extends({}, model.rootSpec));
  emitChange();
}

var getCurrentModel = exports.getCurrentModel = function getCurrentModel(spec) {
  if (!spec) {
    return model;
  }

  function loop(cur) {
    var cp = _extends({}, cur);
    if (cur.children) {
      cp.children = cur.children.map(function (child) {
        return loop(child);
      });
    }
    return cp;
  }

  model.rootSpec = loop(spec);

  return model;
};

var startEditingSpec = exports.startEditingSpec = function startEditingSpec(spec) {
  console.log('startEditingSpec(' + JSON.stringify(spec) + ")");
  model.editingSpec = spec;
  model.activeTabKey = "property-tab";
  emitChange();
};

var editSpec = exports.editSpec = function editSpec(spec) {
  function loop(cur) {
    if (cur.key !== spec.key) {
      if (cur.children) {
        cur.children = cur.children.map(function (item) {
          return loop(item);
        });
      }
    } else {
      cur.config = _extends({}, spec.config);
      // console.log('spec config to (' + JSON.stringify(cur.config) + ')')
    }
    return _extends({}, cur);
  }

  if (!spec.config) {
    // no config, no update
    return;
  }

  model.rootSpec = loop(model.rootSpec);
  emitChange();
};

var changeTabKey = exports.changeTabKey = function changeTabKey(key) {
  console.log('changeTabKey(' + key + ')');
  model.activeTabKey = key;
  emitChange();
};

var removeSpec = exports.removeSpec = function removeSpec(spec) {
  console.log('will remove spec (' + JSON.stringify(spec) + ")");
  function loop(parent) {
    if (parent.leaf) {
      return parent;
    }

    if (!parent.children) {
      return parent;
    }

    // let newChildren = parent.children.filter(item => item.key !== spec.key)
    var i = parent.children.findIndex(function (item) {
      return item.key === spec.key;
    });
    if (i >= 0) {
      //removed
      parent.children.splice(i, 1);
    } else {
      //dfs
      parent.children = parent.children.map(loop);
    }

    return _extends({}, parent);
  }

  model.rootSpec = loop(_extends({}, model.rootSpec));
  emitChange();
};

function upSpec(spec) {
  function loop(parent) {
    if (parent.leaf) {
      return parent;
    }

    if (!parent.children) {
      return parent;
    }

    // let newChildren = parent.children.filter(item => item.key !== spec.key)
    var i = parent.children.findIndex(function (item) {
      return item.key === spec.key;
    });
    if (i === 0) {
      //can't up anymore
      //parent.children.splice(i, 1)
    } else if (i > 0) {
      // take it
      var _parent$children$spli = parent.children.splice(i, 1),
          _parent$children$spli2 = _slicedToArray(_parent$children$spli, 1),
          item = _parent$children$spli2[0];

      parent.children.splice(i - 1, 0, item);
    } else {
      //dfs
      parent.children = parent.children.map(loop);
    }

    return _extends({}, parent);
  }

  model.rootSpec = loop(model.rootSpec);
  emitChange();
}

function downSpec(spec) {
  function loop(parent) {
    if (parent.leaf) {
      return parent;
    }

    if (!parent.children) {
      return parent;
    }

    // let newChildren = parent.children.filter(item => item.key !== spec.key)
    var i = parent.children.findIndex(function (item) {
      return item.key === spec.key;
    });
    if (i === parent.children.length - 1) {
      //can't up anymore
      //parent.children.splice(i, 1)
    } else if (i >= 0) {
      // take next
      var _parent$children$spli3 = parent.children.splice(i + 1, 1),
          _parent$children$spli4 = _slicedToArray(_parent$children$spli3, 1),
          item = _parent$children$spli4[0];

      parent.children.splice(i, 0, item);
    } else {
      //dfs
      parent.children = parent.children.map(loop);
    }

    return _extends({}, parent);
  }

  model.rootSpec = loop(model.rootSpec);
  emitChange();
}
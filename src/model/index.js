import randomString from 'random-string'

let observers = []

function nextKey() {
  return randomString({ length: 20 })
}

let model = {
  rootSpec: {
    children: [],
    leaf: false,
    key: nextKey()
  },
  activeTabKey: "widgets-tab",
  editingSpec: null
}

function emitChange() {
  if (observers) {
    for (var i = 0; i < observers.length; i++) {
      observers[i](model)
    }
  }
}


export function observe(o) {
  observers.push(o)
  emitChange()
  return () => {
    observers = observers.filter(x => x !== o)
  }
}

export function addSpec(parentSpec, childSpec) {
  console.log('addChild called')
  function loop(cur) {
    if (cur.key === parentSpec.key) {
      if (!cur.children) {
        cur.children = []
      }

      let obj = { ...childSpec }
      obj.key = nextKey()
      // obj.config = { ...childSpec.config }

      cur.children.push(obj)
    } else if (cur.children) {
      cur.children = cur.children.map(item => loop(item))
    }
    return cur
  }
  model.rootSpec = loop({ ...model.rootSpec })
  emitChange()
}

export const getCurrentModel = (spec) => {
  if (!spec) {
    return model
  }

  function loop(cur) {
    var cp = { ...cur }
    if (cur.children) {
      cp.children = cur.children.map(child => loop(child))
    }
    return cp
  }

  model.rootSpec = loop(spec)
  
  return model
}

export const startEditingSpec = (spec) => {
  console.log('startEditingSpec(' + JSON.stringify(spec) + ")")
  model.editingSpec = spec
  model.activeTabKey = "property-tab"
  emitChange()
}

export const editSpec = (spec) => {
  function loop(cur) {
    if (cur.key !== spec.key) {
      if (cur.children) {
        cur.children = cur.children.map(item => loop(item))
      }
    } else {
      cur.config = { ...spec.config }
      // console.log('spec config to (' + JSON.stringify(cur.config) + ')')
    }
    return { ...cur }
  }

  if (!spec.config) {
    // no config, no update
    return
  }

  model.rootSpec = loop(model.rootSpec)
  emitChange()
}

export const changeTabKey = (key) => {
  console.log('changeTabKey(' + key + ')')
  model.activeTabKey = key
  emitChange()
}

export const removeSpec = (spec) => {
  console.log('will remove spec (' + JSON.stringify(spec) + ")")
  function loop(parent) {
    if (parent.leaf) {
      return parent
    }

    if (!parent.children) {
      return parent
    }

    // let newChildren = parent.children.filter(item => item.key !== spec.key)
    let i = parent.children.findIndex(item => item.key === spec.key)
    if (i >= 0) {
      //removed
      parent.children.splice(i, 1)
    } else {
      //dfs
      parent.children = parent.children.map(loop)
    }


    return { ...parent }
  }

  model.rootSpec = loop({ ...model.rootSpec })
  emitChange()
}

export function upSpec(spec) {
  function loop(parent) {
    if (parent.leaf) {
      return parent
    }

    if (!parent.children) {
      return parent
    }

    // let newChildren = parent.children.filter(item => item.key !== spec.key)
    let i = parent.children.findIndex(item => item.key === spec.key)
    if (i === 0) {
      //can't up anymore
      //parent.children.splice(i, 1)
    } else if (i > 0) {
      // take it
      let [item] = parent.children.splice(i, 1)
      parent.children.splice(i - 1, 0, item)
    } else {
      //dfs
      parent.children = parent.children.map(loop)
    }

    return { ...parent }
  }

  model.rootSpec = loop(model.rootSpec)
  emitChange()
}


export function downSpec(spec) {
  function loop(parent) {
    if (parent.leaf) {
      return parent
    }

    if (!parent.children) {
      return parent
    }

    // let newChildren = parent.children.filter(item => item.key !== spec.key)
    let i = parent.children.findIndex(item => item.key === spec.key)
    if (i === parent.children.length - 1) {
      //can't up anymore
      //parent.children.splice(i, 1)
    } else if (i >= 0) {
      // take next
      let [item] = parent.children.splice(i + 1, 1)
      parent.children.splice(i, 0, item)
    } else {
      //dfs
      parent.children = parent.children.map(loop)
    }

    return { ...parent }
  }

  model.rootSpec = loop(model.rootSpec)
  emitChange()
}
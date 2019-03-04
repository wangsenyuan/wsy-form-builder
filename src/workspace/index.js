import React from 'react'
// import ItemTypes from '../constants'
// import Input from '../components/input'

let renders = {}

export function registerRender(type, render) {
  if (!type || !render) {
    throw new Error("invalid argument")
  }
  if (renders[type]) {
    throw new Error("can't register multiple renders for the same type: " + type)
  }
  renders[type] = render
}

function renderChild(child) {
  if (!child || !child.type) {
    return null
  }
  if (!renders[child.type]) {
    return null
  }
  // console.log('will render child (' + child.type + ')')
  return renders[child.type](child)
}

export function WrapList(List) {
  return (props) => {
    let { spec } = props
    let { children } = spec
    // console.log('WrapList render children (' + length(children) + ') children')
    return <List spec={spec}>
      {children && children.map(child => renderChild(child))}
    </List>
  }
}

function Workspace({ children }) {
  return <div>{children}</div>
}

export default WrapList(Workspace)
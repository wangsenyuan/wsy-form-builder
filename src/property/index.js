import { editSpec } from '../model'

let editors = {}

export const registerPropertyEditor = (type, editor) => {
  if (!type || !editor) {
    throw new Error("invalid argument")
  }

  if (editors[type]) {
    throw new Error("multiple property editors not supported")
  }
  editors[type] = editor
}

export const Editor = (props) => {
  let { spec } = props
  if (!spec || !spec.type) {
    console.warn('no spec found in the obj')
    return null
  }
  if (!editors[spec.type]) {
    console.log('no property editor found for ' + spec.type)
    return null
  }
  return editors[spec.type](props, editSpec)
}
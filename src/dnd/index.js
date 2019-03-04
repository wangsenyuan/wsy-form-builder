import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from '../constants'
import { Icon } from 'antd'
// import ListEl from '../../components/list'
import WorkspaceEl, { WrapList } from '../workspace'
import "./index.scss"
import { addSpec, startEditingSpec, removeSpec, upSpec, downSpec } from '../model'

function dropDropable(types) {
  return (Elem, props) => {
    // console.log('dropDropable called')
    let Res = makeDropable(types, Elem)
    return <Res dropable={true} {...props} />
  }
}

function droppedElem(Elem, drop) {
  return props => {
    let className = "dropped"
    if (drop) {
      className += " droppable"
    }
    return <div className={className}>
      {!drop ? <Elem {...props} /> : drop(Elem, props)}
      <Icon type="edit" onClick={() => startEditingSpec(props.spec)} />
      <Icon type="delete" onClick={() => removeSpec(props.spec)} />
      <Icon type="up" onClick={() => upSpec(props.spec)} />
      <Icon type="down" onClick={() => downSpec(props.spec)} />
    </div>
  }
}

function makeDropable(types, Elem) {
  const dropTarget = {
    canDrop(props, monitor) {
      // console.log('check canDrop: ' + JSON.stringify(props))
      // console.log('workspace canDrop called: ' + JSON.stringify(props))
      // should determine by the type of target
      let ret = props && props.spec && props.spec.leaf === false && !monitor.didDrop()
      // console.log('test canDrop => ' + ret)
      return ret
    },

    drop(props, monitor) {
      if (monitor.didDrop()) {
        // console.log('has already dropped on child target')
        return
      }
      // console.log('drop here (' + JSON.stringify(props.spec) + ')')
      //should update the spec
      let parentSpec = props.spec
      // let item = monitor.getItem()
      // let childSpec = (item && item.spec && { ...item.spec }) || {}
      return { parentSpec }
    }
  }

  function collect(connect) {
    return {
      connectDropTarget: connect.dropTarget()
    }
  }

  function DropableElement(props) {
    let { connectDropTarget, ...rest } = props
    return connectDropTarget(
      <div className="dropable-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Elem {...rest} />
      </div>
    )
  }
  return DropTarget(types, dropTarget, collect)(DropableElement)
}

export function makeDragable(name, type) {
  const elemSource = {
    beginDrag({ spec }) {
      return { spec }
    },
    endDrag(props, monitor) {
      if (!monitor.didDrop()) {
        return
      }
      let { parentSpec } = monitor.getDropResult()

      addSpec(parentSpec, props.spec)
    }
  }

  function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }
  }

  function DraggleElement(props) {
    let { connectDragSource } = props

    return connectDragSource(
      <div style={{ width: '100%', cursor: "pointer" }}>
        <span>{name}</span>
      </div>
    )
  }

  return DragSource(type, elemSource, collect)(DraggleElement)
}

// export const DroppedInput = droppedElem(InputEl)
// export const DroppedList = droppedElem(WrapList(ListEl), dropDropable(ItemTypes.Input))
// export const Input = makeDragable("输入框", ItemTypes.Input)
// export const List = makeDragable("列表", ItemTypes.Input)
export const Workspace = makeDropable([ItemTypes.Input, ItemTypes.List], WorkspaceEl)
export const makeDropElement = droppedElem
export const makeDropList = (acceptType, Elem) => droppedElem(WrapList(Elem), dropDropable(acceptType))
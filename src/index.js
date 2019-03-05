import React from 'react'
// import ItemTypes from '../constants'
import { makeDropElement, makeDropList, makeDragable, makeDropable } from './dnd'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import "./index.scss"
import { observe, getCurrentModel, changeTabKey } from './model'
import { Tabs } from 'antd'
import Workspace, { registerRender } from './workspace'
import { registerPropertyEditor, Editor as PropertyEditor } from './property'

let widgets = []

function defaultLayout(workspace, sidebar) {
  return (
    <div className="stage">
      <div className="workspace">
        {workspace()}
      </div>
      <div className="sidebar">
        {sidebar()}
      </div>
    </div>
  )
}

function Sidebar({ model }) {
  return <Tabs activeKey={model.activeTabKey} onChange={changeTabKey}>
    <Tabs.TabPane tab="Widgets" key="widgets-tab">
      {(widgets && widgets()) || null}
    </Tabs.TabPane>
    <Tabs.TabPane tab="Property" key="property-tab">
      {model.editingSpec ? <PropertyEditor spec={model.editingSpec} /> : "Property"}
    </Tabs.TabPane>
  </Tabs>
}

function Stage({ dndItemTypes, model, layout }) {
  let WS = makeDropable(dndItemTypes, Workspace)

  if (!layout) {
    layout = defaultLayout
  }

  return (
    layout(() => <WS spec={model.rootSpec} />, () => <Sidebar model={model} />)
  )
}

class ModelStage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      model: getCurrentModel()
    }
  }

  componentDidMount() {
    this.unObserve = observe(model => {
      this.setState(model)
    })
  }

  componentWillUnmount() {
    if (this.unObserve) {
      this.unObserve()
      this.unObserve = null
    }
  }

  render() {
    let dndItemTypes = this.props.dndItemTypes || ['INPUT', 'LIST']
    return <Stage model={this.state.model} dndItemTypes={dndItemTypes} layout={this.props.layout} />
  }
}

export const pluginElementPropertyEditoros = fn => {
  fn(registerPropertyEditor)
}

export const pluginDropElementRenders = fn => {
  fn(registerRender, makeDropElement, makeDropList)
}

export const pluginWidgets = fn => {
  let res = fn(makeDragable)
  if (!res) {
    throw new Error("need widgets")
  }
  widgets = res
}

export default DragDropContext(HTML5Backend)(ModelStage)
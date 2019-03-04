import React from 'react'
// import ItemTypes from '../constants'
import { Workspace, makeDropElement, makeDropList, makeDragable } from './dnd'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import "./index.scss"
import { observe, getCurrentModel, changeTabKey } from './model'
import { Tabs } from 'antd'
import { registerRender } from './workspace'
import { registerPropertyEditor, Editor as PropertyEditor } from './property'

let widgets = []

function Sidebar({ model }) {
  return <Tabs activeKey={model.activeTabKey} onChange={changeTabKey}>
    <Tabs.TabPane tab="Widgets" key="widgets-tab">
      {widgets.map(w => w())}
    </Tabs.TabPane>
    <Tabs.TabPane tab="Property" key="property-tab">
      {model.editingSpec ? <PropertyEditor spec={model.editingSpec} /> : "Property"}
    </Tabs.TabPane>
  </Tabs>
}

function Stage({ model }) {
  return (
    <div className="stage">
      <div className="workspace">
        <Workspace spec={model.rootSpec} />
      </div>
      <div className="sidebar">
        <Sidebar model={model} />
      </div>
    </div>
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
    return <Stage model={this.state.model} />
  }
}

export const pluginElementPropertyEditoros = fn => {
  fn(registerPropertyEditor)
}

export const pluginDropElementRenders = fn => {
  fn(registerRender, makeDropElement, makeDropList)
}

export const pluginWidgets = fn => {
  let res = fn()
  if (!res) {
    throw new Error("need widgets")
  }
  widgets = res.map(w => {
    let Item = makeDragable(w.name, w.type)
    return props => <Item key={w.spec.name} className="drag-item" spec={w.spec} {...props} />
  })
}

export default DragDropContext(HTML5Backend)(ModelStage)
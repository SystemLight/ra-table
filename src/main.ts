import './style.scss'

import React from 'react'
import {createRoot} from 'react-dom/client'

import App from './App'

let root = createRoot(document.getElementById('root')!)
root.render(React.createElement(
  React.StrictMode,
  null,
  React.createElement(App)
))

if (module.hot) {
  module.hot.accept('./App', function () {
    root.unmount()
    root = createRoot(document.getElementById('root')!)
    root.render(React.createElement(
      React.StrictMode,
      null,
      React.createElement(App)
    ))
  })
}

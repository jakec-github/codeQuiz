import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import Main from './containers/main'
import User from './containers/user'
import Icon from './containers/icon'

import store from './store'

function App() {
  return (
    <div id="react-wrapper">
      <User />
      <header className="header">
        <Icon />
      </header>
      <main>
        <div className="app" id="quiz">
          <Main />
        </div>
      </main>
    </div>
  )
}

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('react-entry'),
)

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import Main from './containers/main'
import User from './containers/user'

import store from './store'

function App() {
  return (
    <div id="react-wrapper">
      <header>
        <h2>&lt;code_quiz&gt;</h2>
        <div id="user-icon-wrapper">
          <User />
        </div>
      </header>
      <main>
        <div id="quiz">
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

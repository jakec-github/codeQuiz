import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/main'
import User from './components/user'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: '',
      loggedIn: false,
    }
  }

  handleLogin = (userId) => {
    this.setState({
      userId,
      loggedIn: true,
    })
  }

  handleLogOut = () => {
    this.setState({
      userId: '',
      loggedIn: false,
    })
  }

  render() {
    return (
      <div id="react-wrapper">
        <header>
          <h2>&lt;code_quiz&gt;</h2>
          <div id="user-icon-wrapper">
            <User
              handleLogin={this.handleLogin}
              handleLogOut={this.handleLogOut}
              userId={this.state.userId}
              loggedIn={this.state.loggedIn}
            />
          </div>
        </header>
        <main>
          <div id="quiz">
            <Main
              userId={this.state.userId}
              loggedIn={this.state.loggedIn}
            />
          </div>
        </main>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('react-entry'),
)

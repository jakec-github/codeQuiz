import React from 'react'
import PropTypes from 'prop-types'

import SignUp from './user/signup'
import Login from './user/login'

export default class extends React.Component {
  static propTypes = {
    handleLogin: PropTypes.func.isRequired,
    handleLogOut: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      authOpen: false,
      authType: 'sign up',
      username: '',
      password: '',
      confirmPassword: '',
      loginError: false,
    }
  }

  componentDidMount = () => {
    // Pretty sure this can be done with an actual boolean
    console.log('-------')
    console.log(document.getElementById('react-entry').dataset.user)
    if (document.getElementById('react-entry').dataset.user === 'true') {
      // Can't see the use in setting username here. That should just be for the fields
      this.setState({
        username: document.getElementById('react-entry').dataset.username,
      })
      this.props.handleLogin(document.getElementById('react-entry').dataset.id)
    }
  }

  handleUserIconClick = () => {
    this.setState({ authOpen: true })
  }

  handleEscapeClick = () => {
    this.setState({
      authOpen: false,
      loginError: false,
      password: '',
      confirmPassword: '',
    })
  }

  handleTypeClick = (event) => {
    this.setState({ authType: event.target.dataset.type })
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value.replace(' ', '') })
  }

  handleSubmitClick = (event) => {
    event.preventDefault()
    console.log(this.state.username)
    console.log(this.state.password)
    console.log(this.state.confirmPassword)

    if (this.state.password !== this.state.confirmPassword && event.target.name === 'register') {
      return
    }

    const data = {
      username: this.state.username,
      password: this.state.password,
    }
    console.log(event.target.name)
    fetch(`/${event.target.name}`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 401) {
          this.setState({
            loginError: true,
          })
          return 'Error'
        }
        return response.json()
      })
      .then((response) => {
        if (response === 'Error') {
          return
        }
        if (response.username === this.state.username) {
          console.log(response.user_id)
          this.setState({
            authOpen: false,
            // Does username need to be set here?
            username: response.username,
          })
          console.log(this.props)
          console.log(this.props.handleLogin)
          this.props.handleLogin(response.user_id)
        }
      })
  }

  handleLogOut = () => {
    console.log('Logging out')
    fetch('/logout', {
      method: 'post',
      credentials: 'include',
    })
      .then((response) => {
        // password should be removed earlier
        console.log('Almost there')
        if (response.status === 200) {
          this.setState({
            username: '',
            password: '',
            authOpen: false,
          })
          this.props.handleLogOut()
        }
      })
  }

  render() {
    const icon = this.props.loggedIn ? 'static/img/118-user-check.svg' : 'static/img/114-user.svg'
    return (
      <div id="react-wrapper">
        <img alt="User authentication" src={icon} onClick={this.handleUserIconClick} />
        {this.state.authOpen &&
          <article id="user-auth">
            <div id="escape-wrapper">
              <p id="auth-escape" onClick={this.handleEscapeClick}>X</p>
            </div>
            {!this.props.loggedIn &&
              <div id="auth-wrapper">
                <article id="type-selector">
                  <div id="sign-up" className={this.state.authType === 'sign up' ? 'type-button active' : 'type-button'} data-type="sign up" onClick={this.handleTypeClick}>Sign Up</div>
                  <div id="login" className={this.state.authType === 'login' ? 'type-button active' : 'type-button'} data-type="login" onClick={this.handleTypeClick}>Login</div>
                </article>
                {this.state.authType === 'sign up' &&
                  <SignUp
                    handleInputChange={this.handleInputChange}
                    handleSubmitClick={this.handleSubmitClick}
                    username={this.state.username}
                    password={this.state.password}
                    confirmPassword={this.state.confirmPassword}
                  />
                }
                {this.state.authType === 'login' &&
                  <Login
                    handleInputChange={this.handleInputChange}
                    handleSubmitClick={this.handleSubmitClick}
                    username={this.state.username}
                    password={this.state.password}
                    loginError={this.state.loginError}
                  />
                }
              </div>

            }
            {this.props.loggedIn &&
              <div id="username-wrapper">
                <p>You are logged in as {this.state.username}</p>
                <button onClick={this.handleLogOut}>Log Out</button>
              </div>
            }
          </article>
        }
      </div>
    )
  }
}

/*jshint esversion: 6 */
import React from 'react';

export class User extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      type: 'sign up',
      username: '',
      password: ''
    };
  }

  componentDidMount = () => {
    // Pretty sure this can be done with an actual boolean
    console.log('-------')
    console.log(document.getElementById('react-entry').dataset.user);
    if (document.getElementById('react-entry').dataset.user === "true") {
      this.setState({
        loggedIn: true,
        username: document.getElementById('react-entry').dataset.username,
        userId: document.getElementById('react-entry').dataset.id
      })
    }
  }

  handleUserIconClick = () => {
    this.setState({open: true});
  }

  handleEscapeClick = () => {
    this.setState({open: false});
  }

  handleTypeClick = (event) => {
    this.setState({type: event.target.dataset.type})
  }

  handleInputChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmitClick = (event) => {
    event.preventDefault();
    let data = {
      username: this.state.username,
      password: this.state.password
    }
    console.log(event.target.name)
    fetch(`/${event.target.name}`, {
      method: 'post',
      headers: {
        "Content-type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then((data) => {
      return data.json()
    })
    .then((response) => {

      if (response.username === this.state.username) {
        console.log(response.user_id)
        this.setState({
          open: false,
          loggedIn: true,
          username: response.username
         })
         console.log(this.props);
         console.log(this.props.handlelogin);
         this.props.handleLogin(response.user_id)
      }
    })
  }

  handleLogOut = () => {
    console.log('Logging out');
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
          open: false
        })
        this.props.handleLogOut()
      }
    })
  }

  render() {
    let icon = this.props.loggedIn ? "static/img/118-user-check.svg" : "static/img/114-user.svg";
    return (
      <div id="react-wrapper">
        <img alt="User authentication" src={icon} onClick={this.handleUserIconClick} />
        {this.state.open &&
          <article id="user-auth">
            <div id="escape-wrapper">
              <p id="auth-escape" onClick={this.handleEscapeClick}>X</p>
            </div>
            {!this.props.loggedIn &&
              <div id="auth-wrapper">
                <article id="type-selector">
                  <div id="sign-up" className={this.state.type === 'sign up' ? 'type-button active' : 'type-button'} data-type="sign up" onClick={this.handleTypeClick}>Sign Up</div>
                  <div id="login" className={this.state.type === 'login' ? 'type-button active' : 'type-button'} data-type="login" onClick={this.handleTypeClick}>Login</div>
                </article>
                {this.state.type === 'sign up' &&
                  <form>
                    <input name="username" placeholder="Username" onChange={this.handleInputChange}/>
                    <input name="password" type="password" placeholder="Password"/>
                    <input className="submit" name="register" onClick={this.handleSubmitClick} type="submit" />
                  </form>
                }
                {this.state.type === 'login' &&
                  <form>
                    <input name="username" placeholder="Username" onChange={this.handleInputChange}/>
                    <input name="password" type="password" placeholder="Password"/>
                    <input className="submit" name="login" onClick={this.handleSubmitClick} type="submit" />
                  </form>
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

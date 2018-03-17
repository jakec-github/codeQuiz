/*jshint esversion: 6 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Start, Question, Result, Home } from './components.js';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      location: 'home',
      question: 0,
      quiz: 0,
      questionSet: [],
      quizSize: 0,
      score: 0
    };
  }

  // componentDidMount() {
    // fetch('/quiz')
    // .then(data => data.json())
    // .then(data => {
    //   console.log(data);
    //   this.setState({questionSet: data,
    //                  quizSize: data.length
    //                });
    // });
  // }
  // This may need adapting now there is a homepage
  changeLocation = (newLocation) => {

    if (newLocation === 'start' || newLocation === 'home') {
      this.setState({location: newLocation,
                     question: 0,
                     score: 0
      });
    }
    else {
      this.setState({location: newLocation});
    }
  };

  setQuestions = (questionSet) => {
    console.log('Setting question')
    this.setState({
      questionSet: questionSet,
      quizSize: questionSet.length
    });
    console.log(this.state.questionSet);
  }

  iterateQuestion = () => {
    if (this.state.question + 1 >= this.state.quizSize ){
      // Consider resetting question
      this.setState({location: 'result'});
    }
    else {
        this.setState({question: this.state.question + 1});
    }
  }

  iterateScore = () => {
    this.setState({score: this.state.score + 1});
  }

  selectQuiz = (quiz) => {
    this.setState({quiz: quiz});
  }

  render() {
    console.log('score: ' + this.state.score);
    // Consider case statement
    // Also consider nesting code with jsx for a cleaner result
    if (this.state.location === 'home'){
      return (
        <div className="App">
          <Home changeLocation={this.changeLocation}
                selectQuiz={this.selectQuiz} />
        </div>
      )
    }
    else if (this.state.location === 'start'){
      return (
        <div className="App">
          <Start changeLocation={this.changeLocation}
                 quiz={this.state.quiz}
                 setQuestions={this.setQuestions} />
        </div>
      );
    }
    else if (this.state.location === 'quiz'){
      console.log('Loading question ' + this.state.question);
      return (
        <div className="App">
          <Question iterateQuestion={this.iterateQuestion}
                    question={this.state.question}
                    questionSet={this.state.questionSet}
                    iterateScore={this.iterateScore}
                    quizSize={this.state.quizSize}/>
        </div>
      );
    }
    else if (this.state.location === 'result'){
      return (
        <div className="App">
          <Result score={this.state.score}
                  quizSize={this.state.quizSize}
                  changeLocation={this.changeLocation}
                  quiz={this.state.quiz}/>
        </div>
      );
    }

  }
}

class User extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      type: 'sign up',
      username: '',
      userId: '',
      password: '',
      loggedIn: false
    };
  }

  componentDidMount = () => {
    // Pretty sure this can be done with an actual boolean
    console.log('-------')
    console.log(document.getElementById('user-icon-wrapper').dataset.user);
    if (document.getElementById('user-icon-wrapper').dataset.user === "true") {
      this.setState({
        loggedIn: true,
        username: document.getElementById('user-icon-wrapper').dataset.username,
        userId: document.getElementById('user-icon-wrapper').dataset.id
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
          userId: response.user_id
         })
         document.getElementById('user-icon-wrapper').setAttribute('data-id', response.user_id)
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
          loggedIn: false,
          username: '',
          password: '',
          open: false
        })
        document.getElementById('user-icon-wrapper').removeAttribute('data-username')
        document.getElementById('user-icon-wrapper').removeAttribute('data-id')
      }
    })
  }

  render() {
    let icon = this.state.loggedIn ? "static/img/118-user-check.svg" : "static/img/114-user.svg";
    return (
      <div id="react-wrapper">
        <img alt="User authentication" src={icon} onClick={this.handleUserIconClick} />
        {this.state.open &&
          <article id="user-auth">
            <div id="escape-wrapper">
              <p id="auth-escape" onClick={this.handleEscapeClick}>X</p>
            </div>
            {!this.state.loggedIn &&
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
            {this.state.loggedIn &&
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

ReactDOM.render(
  <App />,
  document.getElementById('quiz')
);

ReactDOM.render(
  <User />,
  document.getElementById('user-icon-wrapper')
);

/*jshint esversion: 6 */
import React from 'react';

// Consider better organisation of components

export class Home extends React.Component {

  constructor(props) {
    super(props)
    // Make sure to wip scores if unauthenticated
    this.state = {
      allQuizzes: [],
      scores: []
    }
  }

  componentDidMount = () => {
    fetch('/allquizzes')
    .then(data => data.json())
    .then(data => {
      console.log(data);
      this.setState({allQuizzes: data})

      if (this.props.loggedIn) {
        let query = {
          user_id: parseInt(this.props.userId, 10), // need to find this info
        }
        return fetch('/userscores', {
          method: 'post',
          headers: {
            "Content-type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify(query)
        })
      }
      return false

    })
    .then(data => data ? data.json() : false)
    .then(data => {
      console.log('All scores for user')
      console.log(data)
      this.setState({scores: data ? data : [] })
    })
  }

  handleQuizClick = (event) => {
    let quizId = event.target.dataset.id;
    this.props.selectQuiz(quizId);
    this.props.changeLocation('start');
  }

  render() {
    let quizzes = []

    // Probably best to use a forEach here since no array is returned
    this.state.allQuizzes.map((quiz, i) => {
      console.log('Looping through');
      let hasScore = false
      this.state.scores.forEach((score) => {
        if (score.quiz_id === quiz.id) {
          hasScore = (score.score / quiz.length) * 100
          // TODO: change to for loop in order to add break
        }
      })
      // TODO: See if this can be condensed by injecting <p> with ternary
      if (hasScore) {

        quizzes.push(<article className="quiz-option btn" data-id={quiz.id} onClick={this.handleQuizClick} key={i.toString()}>{quiz.name}<p>{hasScore}%</p></article>)
      }
      else {
        quizzes.push(<article className="quiz-option btn" data-id={quiz.id} onClick={this.handleQuizClick} key={i.toString()}>{quiz.name}</article>)
      }
    })

    return (
      <div className="home">
        <p>Pick a quiz</p>
        {quizzes}
      </div>
    )
  }
}

export class Start extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      quiz: {}
    }
  }

  // This request needs to include a quiz id from this.props.quiz
  componentDidMount = () => {
    fetch(`/choosequiz/${this.props.quiz}`)
    .then(data => data.json())
    .then(data => {
      this.props.setQuestions(data.questionSet)
      this.setState({quiz:data.quiz})
    })
  }

  handleStartClick = (event) => {
    this.props.changeLocation('quiz');
  }

  render(){
    return (
      <div className="start">
        <h1>{this.state.quiz.name}</h1>
        <p>{this.state.quiz.description}</p>
        <p>You have {this.state.quiz.timeLimit / 60} minutes</p>
        <div id="start-button" className="nav btn" onClick={this.handleStartClick}>Start</div>
      </div>
    )
  }
}


export class Question extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      status: 'answers'
    };
  }

  changeStatus = (newStatus) => {
    this.setState({status: newStatus});
  };

  render(){
    let next = this.props.question + 1 === this.props.quizSize ? 'See result' : 'Next question';
    // Currently this is defined in three separate places
    let thisQuestion = this.props.questionSet[this.props.question];

    return (
      <div className="question">
        <Progress question={this.props.question} quizSize={this.props.quizSize}/>
        <p id ="question-text">
          {this.props.questionSet[this.props.question].text}
        </p>
        {thisQuestion.codes.length === 0 ? (undefined):(
          <Code question={this.props.question}
                questionSet={this.props.questionSet}/>
        )}
        <Panel status={this.state.status}
               changeStatus={this.changeStatus}
               iterateQuestion={this.props.iterateQuestion}
               question={this.props.question}
               questionSet={this.props.questionSet}
               iterateScore={this.props.iterateScore}
               next={next}/>
      </div>
    )
  }
}


export class Result extends React.Component {

  handleMenuClick = () => {
    this.props.changeLocation('home');
  }

  componentDidMount = () => {
    let data = {
      score: this.props.score,
      quiz_id: this.props.quiz,
      user_id: parseInt(this.props.userId, 10)
    }

    if (this.props.loggedIn) {
      fetch("/score", {
        method: "POST",
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        credentials: 'include',
        body: JSON.stringify(data)
      })
    }
  }

  render(){
    return (
      <div>
        <p>You got...</p>
        <p>{this.props.score} out of {this.props.quizSize}</p>
        <div id="menu" className="nav btn" onClick={this.handleMenuClick}>Menu</div>
      </div>
    )
  }
}

class Panel extends React.Component {

  handleNextClick = () => {
    this.props.iterateQuestion();
    this.props.changeStatus('answers');
  }

  handleAnswerClick = (event) => {
    let correct = event.target.dataset.correct;
    let data = {
      id: this.props.questionSet[this.props.question].id,
      correct: correct
    }
    if (correct === 'correct'){
      this.props.changeStatus('correct');
      this.props.iterateScore();
    }
    else {
      this.props.changeStatus('incorrect');
    }
    console.log("updated");
    fetch('/difficulty', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data)
    })
    .then(() => console.log('Worked'))
    .catch((err) => console.log(err))
  }

  handleLearnClick = () => {
    this.props.changeStatus('explanation');
  }

  render(){
    // Consider nesting if statement in return statement
    let thisQuestion = this.props.questionSet[this.props.question];
    if (this.props.status === 'answers') {
      let answers = [];

      for (let i = 0; i < thisQuestion.duds.length; i++){
        answers.push(<article className="answer btn" data-correct="incorrect" onClick={this.handleAnswerClick} key={i.toString()}>{thisQuestion.duds[i]}</article>)
      }
      answers.push(<article className="answer btn" data-correct="correct" onClick={this.handleAnswerClick}>{thisQuestion.answer}</article>)
      for (let i = answers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (answers.length));
        let temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
    }

      return (
        <div className="panel" id="answer-panel">
          {answers}
        </div>
      )
    }
    // This could be done succintly using the ternary operator
    else if (this.props.status === 'correct') {
      return (
        <div className="panel" id="correct-panel">
          <p>Correct</p>
          <article className="answer btn" id="learn" onClick={this.handleLearnClick}>Learn more</article>
          <article className="answer btn" id="next" onClick={this.handleNextClick}>{this.props.next}</article>
        </div>
      )
    }
    else if (this.props.status === 'incorrect') {
      return (
        <div className="panel" id="incorrect-panel">
          <p>Wrong Answer!</p>
          <article className="answer btn" id="learn" onClick={this.handleLearnClick}>See answer</article>
          <article className="answer btn" id="next" onClick={this.handleNextClick}>{this.props.next}</article>
        </div>
      )
    }
    else {
      return (
        <div className="panel" id="explanation-panel">
          <p>{thisQuestion.answer}</p>
          <p>{thisQuestion.explanation}</p>
          <article className="answer btn" id="next" onClick={this.handleNextClick}>{this.props.next}</article>
        </div>
      )
    }
  }
}

class Progress extends React.Component {
  render(){
    let progress = (this.props.question + 1) / this.props.quizSize * 100;
    let style = {
      width: progress + '%'
    }
    return (
      <div id="total-progress">
        <div id="progress-fraction">
          <p>
            {this.props.question + 1}/{this.props.quizSize}
          </p>
        </div>
        <div id="current-progress" style={style}>
        </div>
      </div>
    )
  }
}

class Code extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      code: 0
    };
  }

  handleTabClick = (event) => {
    console.log(event.target.dataset.value);
    let newCode = event.target.dataset.value;
    if (newCode !== this.state.code) {

      this.setState({
        code: newCode
      })
    }
  }

  render() {
    let thisQuestion = this.props.questionSet[this.props.question];
    let codes = [];
    let tabs = [];
    for (let i = 0; i < thisQuestion.codes.length; i++) {
      console.log(thisQuestion.codes[i].type);
      console.log('i now = ' + i);
      console.log('this.state.code = ' + this.state.code);
      tabs.push(<article onClick={this.handleTabClick} id={i == this.state.code ? 'selected' : 'unselected'} className="tab" data-value={i.toString()} key={i.toString()}>{thisQuestion.codes[i].type}</article>)
      codes.push(<article id={'code-' + i.toString()} className="code-block" key={i.toString()}>{thisQuestion.codes[i].sample}</article> )
    }
    let tabs_style= {
      gridTemplateColumns: 'repeat(' + tabs.length + ', 1fr)'
    };
    return (
      <article id="code">
        <div id="code-tabs" style={tabs_style}>
          {tabs}
        </div>
        <pre id="monospace">
          <code>
            {codes[this.state.code]}
          </code>
        </pre>
      </article>
    )
  }
}

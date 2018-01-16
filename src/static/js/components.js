/*jshint esversion: 6 */
import React from 'react';

// Consider better organisation of components

export class Start extends React.Component {

  handleStartClick = (event) => {
    this.props.changeLocation('quiz');
  }

  render(){
    return (
      <div className="start">
        <p>This is the start menu</p>
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
    let progress = (this.props.question + 1) / this.props.quizSize * 100;
    let next = this.props.question + 1 === this.props.quizSize ? 'See result' : 'Next question';

    return (
      <div className="question">
        <Progress progress={progress}/>
        <p id ="question-text">
          {this.props.questionSet[this.props.question].text}
        </p>
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
    this.props.changeLocation('start');
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
        answers.push(<article className="answer btn" data-correct="incorrect" onClick={this.handleAnswerClick}>{thisQuestion.duds[i]}</article>)
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
    let style = {
      width: this.props.progress + '%'
    }
    return (
      <div id="total-progress">
        <div id="current-progress" style={style}>
        </div>
      </div>
    )
  }
}

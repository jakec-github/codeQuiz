/*jshint esversion: 6 */
import React from 'react';

// Consider better organisation of components

export class Start extends React.Component {

  handleStartClick = (event) => {
    this.props.changeLocation('quiz');
  }

  render(){
    console.log('Start loading');
    return (
      <div className="start">
        <p>This is the start menu</p>
        <div id="start-button" onClick={this.handleStartClick}>Start</div>
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
    return (
      <div className="question">
        <p id ="question-text">
          {this.props.questionSet[this.props.question].question}
        </p>
        <Panel status={this.state.status}
               changeStatus={this.changeStatus}
               iterateQuestion={this.props.iterateQuestion}
               question={this.props.question}
               questionSet={this.props.questionSet}
               iterateScore={this.props.iterateScore}/>
      </div>
    )
  }
}


export class Result extends React.Component {
  render(){
    console.log('Loading results');
    return (
      <div>
        <p>You got...</p>
        <p>{this.props.score} out of {this.props.quizSize}</p>
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
    if (event.target.dataset.correct === 'correct'){
      this.props.changeStatus('correct');
      this.props.iterateScore();
    }
    else {
      this.props.changeStatus('incorrect');
    }
  }

  render(){
    // Consider nesting if statement in return statement
    if (this.props.status === 'answers') {
      let answers = [];
      let thisQuestion = this.props.questionSet[this.props.question];
      for (let i = 0; i < thisQuestion.incorrect.length; i++){
        answers.push(<article className="answer" data-correct="incorrect" onClick={this.handleAnswerClick}>{thisQuestion.incorrect[i]}</article>)
      }
      answers.push(<article className="answer" data-correct="correct" onClick={this.handleAnswerClick}>{thisQuestion.correct}</article>)
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
    else if (this.props.status === 'correct') {
      return (
        <div className="panel" id="correct-panel">
          <p>Correct</p>
          <article className="answer" id="learn">Learn more</article>
          <article className="answer" id="next" onClick={this.handleNextClick}>Next question</article>
        </div>
      )
    }
    else {
      return (
        <div className="panel" id="incorrect-panel">
          <p>Wrong Answer!</p>
          <article className="answer" id="learn">See answer</article>
          <article className="answer" id="next" onClick={this.handleNextClick}>Next question</article>
        </div>
      )
    }
  }
}

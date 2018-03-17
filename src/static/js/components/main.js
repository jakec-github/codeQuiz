import React from 'react';
import { Start, Question, Result, Home } from './quiz.js';

export class Main extends React.Component {

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
                  quiz={this.state.quiz}
                  userId={this.props.userId}
                  loggedIn={this.loggedIn}/>
        </div>
      );
    }

  }
}
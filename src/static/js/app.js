/*jshint esversion: 6 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Start, Question, Result} from './components.js';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      location: 'start',
      question: 0,
      questionSet: [],
      quizSize: 0,
      score: 0
    };
  }

  componentDidMount() {
    fetch('/quiz')
    .then(data => data.json())
    .then(data => {
      console.log(data);
      this.setState({questionSet: data,
                     quizSize: data.length
                   });
    });
  }

  changeLocation = (newLocation) => {

    if (newLocation === 'start') {
      this.setState({location: newLocation,
                     question: 0,
                     score: 0
      });
    }
    else {
      this.setState({location: newLocation});
    }
  };

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

  render() {
    console.log('score: ' + this.state.score);
    // Consider case statement
    // Also consider nesting code with jsx for a cleaner result
    if (this.state.location === 'start'){
      return (
        <div className="App">
          <Start changeLocation={this.changeLocation} />
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
                  changeLocation={this.changeLocation}/>
        </div>
      );
    }

  }
}

ReactDOM.render(
  <App />,
  document.getElementById('quiz')
);

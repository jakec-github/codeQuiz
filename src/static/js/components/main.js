import React from 'react'
import PropTypes from 'prop-types'
import Home from './quiz/home'
import Start from './quiz/start'
import Question from './quiz/question'
import Result from './quiz/result'

export default class extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      location: 'home',
      question: 0,
      quiz: 0,
      questionSet: [],
      quizSize: 0,
      score: 0,
    }
  }

  setQuestions = (questionSet) => {
    console.log('Setting question')
    this.setState({
      questionSet,
      quizSize: questionSet.length,
    })
    console.log(this.state.questionSet)
  }

  // This may need adapting now there is a homepage
  changeLocation = (newLocation) => {
    if (newLocation === 'start' || newLocation === 'home') {
      this.setState({
        location: newLocation,
        question: 0,
        score: 0,
      })
    } else {
      this.setState({ location: newLocation })
    }
  };

  iterateQuestion = () => {
    if (this.state.question + 1 >= this.state.quizSize) {
      // Consider resetting question
      this.setState({ location: 'result' })
    } else {
      this.setState({ question: this.state.question + 1 })
    }
  }

  iterateScore = () => {
    this.setState({ score: this.state.score + 1 })
  }

  selectQuiz = (quiz) => {
    console.log(quiz)
    this.setState({ quiz })
  }

  render() {
    // console.log('score: ' + this.state.score)
    // Consider case statement
    // Also consider nesting code with jsx for a cleaner result
    return (
      <div className="App">
        { this.state.location === 'home' &&
          <Home
            changeLocation={this.changeLocation}
            selectQuiz={this.selectQuiz}
            userId={this.props.userId}
            loggedIn={this.props.loggedIn}
          />
        }
        { this.state.location === 'start' &&
          <Start
            changeLocation={this.changeLocation}
            quiz={this.state.quiz}
            setQuestions={this.setQuestions}
          />
        }
        { this.state.location === 'quiz' &&
          <Question
            iterateQuestion={this.iterateQuestion}
            question={this.state.question}
            questionSet={this.state.questionSet}
            iterateScore={this.iterateScore}
            quizSize={this.state.quizSize}
          />
        }
        { this.state.location === 'result' &&
          <Result
            score={this.state.score}
            quizSize={this.state.quizSize}
            changeLocation={this.changeLocation}
            quiz={this.state.quiz}
            userId={this.props.userId}
            loggedIn={this.props.loggedIn}
          />
        }
      </div>
    )
  }
}

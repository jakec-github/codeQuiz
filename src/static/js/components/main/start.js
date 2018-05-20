import React from 'react'
import PropTypes from 'prop-types'


export default class extends React.Component {
  static propTypes = {
    changeLocation: PropTypes.func.isRequired,
    setQuestions: PropTypes.func.isRequired,
    quizId: PropTypes.string.isRequired,
    resetQuiz: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      quizData: {},
    }
  }

  componentDidMount = () => {
    fetch(`/choosequiz/${this.props.quizId}`)
      .then(data => data.json())
      .then((data) => {
        this.props.setQuestions(data.questionSet)
        this.setState({ quizData: data.quiz })
      })
  }

  handleStartClick = (event) => {
    this.props.resetQuiz()
    this.props.changeLocation('quiz')
  }

  render() {
    return (
      <div className="start">
        <h1 className="start__title">{this.state.quizData.name}</h1>
        <p className="start__description">{this.state.quizData.description}</p>
        { this.state.quizData.timeLimit > 0 &&
          <p className="start__timer">You have {this.state.quizData.timeLimit / 60} minutes</p>
        }
        <div id="start-button" className="button button--nav" onClick={this.handleStartClick}>Start</div>
      </div>
    )
  }
}

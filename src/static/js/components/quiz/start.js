import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    changeLocation: PropTypes.func.isRequired,
    setQuestions: PropTypes.func.isRequired,
    quiz: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      quiz: {},
    }
  }

  // This request needs to include a quiz id from this.props.quiz
  componentDidMount = () => {
    fetch(`/choosequiz/${this.props.quiz}`)
      .then(data => data.json())
      .then((data) => {
        this.props.setQuestions(data.questionSet)
        this.setState({ quiz: data.quiz })
      })
  }

  handleStartClick = (event) => {
    this.props.changeLocation('quiz')
  }

  render() {
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

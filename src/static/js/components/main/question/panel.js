import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    questionNumber: PropTypes.number.isRequired,
    questionSet: PropTypes.arrayOf(PropTypes.object).isRequired,
    iterateQuestion: PropTypes.func.isRequired,
    iterateScore: PropTypes.func.isRequired,
    changeQuestionStatus: PropTypes.func.isRequired,
    questionStatus: PropTypes.string.isRequired,
    next: PropTypes.string.isRequired,
    // quizSize: PropTypes.number.isRequired,
    changeLocation: PropTypes.func.isRequired,
  }

  handleNextClick = () => {
    if (this.props.questionNumber < this.props.questionSet.length - 1) {
      this.props.iterateQuestion()
    } else {
      this.props.changeLocation('result')
    }

    // this.props.oldIterateQuestion()
    this.props.changeQuestionStatus('answers')
  }

  handleAnswerClick = (event) => {
    const { correct } = event.target.dataset
    const data = {
      id: this.props.questionSet[this.props.questionNumber].id,
      correct,
    }
    if (correct === 'correct') {
      this.props.changeQuestionStatus('correct')
      this.props.iterateScore()
    } else {
      this.props.changeQuestionStatus('incorrect')
    }
    console.log('updated')
    fetch('/difficulty', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(() => console.log('Worked'))
      .catch(err => console.log(err))
  }

  handleLearnClick = () => {
    this.props.changeQuestionStatus('explanation')
  }

  render() {
    // Consider nesting if statement in return statement
    const thisQuestion = this.props.questionSet[this.props.questionNumber]
    if (this.props.questionStatus === 'answers') {
      const answers = []

      for (let i = 0; i < thisQuestion.duds.length; i += 1) {
        answers.push(<article className="button button--choice" data-correct="incorrect" onClick={this.handleAnswerClick} key={i.toString()}>{thisQuestion.duds[i]}</article>)
      }
      answers.push(<article className="button button--choice" data-correct="correct" onClick={this.handleAnswerClick}>{thisQuestion.answer}</article>)
      for (let i = answers.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (answers.length))
        const temp = answers[i]
        answers[i] = answers[j]
        answers[j] = temp
      }

      return (
        <div className="question__panel question__panel--choice" id="answer-panel">
          {answers}
        </div>
      )
    } else if (this.props.questionStatus === 'correct') {
      return (
        <div className="question__panel question__panel--correct" id="correct-panel">
          <p className="question__panel-result">Correct</p>
          <article className="button button--choice" id="learn" onClick={this.handleLearnClick}>Learn more</article>
          <article className="button button--choice" id="next" onClick={this.handleNextClick}>{this.props.next}</article>
        </div>
      )
    } else if (this.props.questionStatus === 'incorrect') {
      return (
        <div className="question__panel question__panel--incorrect" id="incorrect-panel">
          <p className="question__panel-result">Wrong Answer!</p>
          <article className="button button--choice" id="learn" onClick={this.handleLearnClick}>See answer</article>
          <article className="button button--choice" id="next" onClick={this.handleNextClick}>{this.props.next}</article>
        </div>
      )
    }
    return (
      <div className="question__panel question__panel--explanation" id="explanation-panel">
        <p className="question__panel-answer">{thisQuestion.answer}</p>
        <p className="question__panel-text">{thisQuestion.explanation}</p>
        <article className="button button--choice" id="next" onClick={this.handleNextClick}>{this.props.next}</article>
      </div>
    )
  }
}

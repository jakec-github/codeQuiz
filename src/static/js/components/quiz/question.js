import React from 'react'
import PropTypes from 'prop-types'
import Progress from './question/progress'
import Code from './question/code'
import Panel from './question/panel'

export default class extends React.Component {
  static propTypes = {
    question: PropTypes.number.isRequired,
    quizSize: PropTypes.number.isRequired,
    questionSet: PropTypes.arrayOf(PropTypes.object).isRequired,
    iterateQuestion: PropTypes.func.isRequired,
    iterateScore: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      status: 'answers',
    }
  }

  changeStatus = (newStatus) => {
    this.setState({ status: newStatus })
  }

  render() {
    const next = this.props.question + 1 === this.props.quizSize ? 'See result' : 'Next question'
    // Currently this is defined in three separate places
    const thisQuestion = this.props.questionSet[this.props.question]
    return (
      <div className="question">
        <Progress
          question={this.props.question}
          quizSize={this.props.quizSize}
        />
        <p id="question-text">
          {this.props.questionSet[this.props.question].text}
        </p>
        { thisQuestion.codes.length === 0 ? (undefined) : (
          <Code
            question={this.props.question}
            questionSet={this.props.questionSet}
          />
        )}
        <Panel
          status={this.state.status}
          changeStatus={this.changeStatus}
          iterateQuestion={this.props.iterateQuestion}
          question={this.props.question}
          questionSet={this.props.questionSet}
          iterateScore={this.props.iterateScore}
          next={next}
        />
      </div>
    )
  }
}

import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    questions: PropTypes.arrayOf(PropTypes.object).isRequired,
    quiz: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      timer: PropTypes.number.isRequired,
    }).isRequired,
    userId: PropTypes.string.isRequired,
    changeLocation: PropTypes.func.isRequired,
    // updateQuestion: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)

    this.state = {
      success: true,
      errors: [],
    }
  }

  componentDidMount = () => {
    // console.log('-------')
    // console.log(this.props.quiz.title)
    // console.log(this.props.questions)
    let errors = false
    if (
      this.props.questions.length >= 3 // Expand to 3 later
      && this.props.quiz.title !== ''
      && this.props.quiz.description !== ''
    ) {
      console.log('All quiz requirements met')
      this.props.questions.forEach((question, i) => {
        console.log('---------')
        console.log(`Question ${i + 1}`)
        console.log(question.duds.length)
        console.log(question.question)
        if (
          !(question.question !== ''
          && question.answer !== ''
          && question.explanation !== ''
          && question.duds.length > 0)
        ) {
          this.setState({
            errors: [...this.state.errors, `Question ${i + 1}`],
          })
          errors = true
        }
      })
      // If we get here error free then it is ready to submit
      if (!errors) {
        console.log('All question requirements met')
        console.log(this.props.questions)
        this.sendQuiz()
      } else {
        this.setState({
          success: false,
        })
      }
    } else {
      // Error may actually be that the quiz isn't long enough
      this.setState({
        success: false,
        errors: [...this.state.errors, `Quiz settings`],
      })
      console.log('A quiz requirement was not met')
    }
  }

  sendQuiz = () => {
    const newQuiz = {
      user_id: parseInt(this.props.userId, 10),
      quiz: this.props.quiz,
      questions: this.props.questions,
    }
    // Send this to back end
    fetch('/new', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(newQuiz),
    })
      .then((response) => {
        console.log('Success')
        console.log(response)
      })
    console.log(JSON.stringify(newQuiz))
  }

  handleHomeClick = () => {
    this.props.changeLocation('home')
  }

  handleCreatorClick = () => {
    this.props.changeLocation('creator')
  }

  render() {
    const errors = this.state.errors.map((error, i) => <li key={i.toString()} className="error">{error}</li>)
    console.log('Created rendered')
    return (
      <div className="submitted">
        { this.state.success &&
          <div className="success-wrapper">
            <p className="success__text">
              Success. Find your quiz on the home screen.
            </p>
            <div className="button button-home" onClick={this.handleHomeClick}>
              Go Home
            </div>
          </div>
        }
        { !this.state.success &&
          <div className="fail-wrapper">
            <p className="fail__text">
               Missing text has been found in the following places
            </p>
            <ul className="errors">
              {errors}
            </ul>
            <div className="button button-creator" onClick={this.handleCreatorClick}>
              Take me back
            </div>
          </div>
        }
      </div>
    )
  }
}

import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    selectQuiz: PropTypes.func.isRequired,
    changeLocation: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    // Make sure to wip scores if unauthenticated
    this.state = {
      allQuizzes: [],
      scores: [],
    }
  }

  componentDidMount = () => {
    fetch('/allquizzes')
      .then(data => data.json())
      .then((data) => {
        console.log(data)
        this.setState({ allQuizzes: data })

        if (this.props.loggedIn) {
          const query = {
            user_id: parseInt(this.props.userId, 10), // need to find this info
          }
          return fetch('/userscores', {
            method: 'post',
            headers: {
              'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(query),
          })
        }
        return false
      })
      .then(data => (data ? data.json() : false))
      .then((data) => {
        console.log('All scores for user')
        console.log(data)
        this.setState({ scores: data || [] })
      })
  }

  handleQuizClick = (event) => {
    const quizId = event.target.dataset.id
    this.props.selectQuiz(quizId)
    this.props.changeLocation('start')
  }

  render() {
    const quizzes = []

    // Probably best to use a forEach here since no array is returned
    this.state.allQuizzes.forEach((quiz, i) => {
      console.log('Looping through')
      let hasScore = false
      this.state.scores.forEach((score) => {
        if (score.quiz_id === quiz.id) {
          hasScore = (score.score / quiz.length) * 100
          // TODO: change to for loop in order to add break
        }
      })
      // TODO: See if this can be condensed by injecting <p> with ternary
      if (hasScore) {
        quizzes.push(<article className="quiz-option btn" data-id={quiz.id} onClick={this.handleQuizClick} key={i.toString()}>{quiz.name}<p>{hasScore}%</p></article>)
      } else {
        quizzes.push(<article className="quiz-option btn" data-id={quiz.id} onClick={this.handleQuizClick} key={i.toString()}>{quiz.name}</article>)
      }
    })

    return (
      <div className="home">
        <p>Pick a quiz</p>
        {quizzes}
      </div>
    )
  }
}

import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    selectQuiz: PropTypes.func.isRequired,
    changeLocation: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    // Make sure to wipe scores if unauthenticated
    // Scores also need to show up on authenticating
    this.state = {
      allQuizzes: [],
      allScores: [],
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
            user_id: parseInt(this.props.userId, 10),
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
        this.setState({ allScores: data || [] })
      })
  }

  handleQuizClick = (event) => {
    const quizId = event.target.dataset.id
    this.props.selectQuiz(quizId)
    this.props.changeLocation('start')
  }

  handleCreateClick = () => {
    this.props.changeLocation('creator')
  }

  render() {
    const quizzes = []

    this.state.allQuizzes.forEach((quiz, i) => {
      console.log('Looping through')
      let hasScore = false
      this.state.allScores.forEach((score) => {
        if (score.quiz_id === quiz.id) {
          hasScore = Math.floor((score.score / quiz.length) * 100)
          // TODO: change to for loop in order to add break
        }
      })
      // TODO: See if this can be condensed by injecting <p> with ternary
      if (hasScore) {
        quizzes.push(<article className="button button--quiz" data-id={quiz.id} onClick={this.handleQuizClick} key={i.toString()}>{quiz.name}<div className="button__insert">{hasScore}%</div></article>)
      } else {
        quizzes.push(<article className="button button--quiz" data-id={quiz.id} onClick={this.handleQuizClick} key={i.toString()}>{quiz.name}</article>)
      }
    })

    return (
      <div className="home">
        {quizzes}
        { Boolean(this.props.userId.length) &&
          <article className="button button--nav" onClick={this.handleCreateClick}>Make a quiz</article>
        }
      </div>
    )
  }
}

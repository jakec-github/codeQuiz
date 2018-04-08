import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    quizSize: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    quiz: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    changeLocation: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    const data = {
      score: this.props.score,
      quiz_id: this.props.quiz,
      user_id: parseInt(this.props.userId, 10),
    }

    if (this.props.loggedIn) {
      fetch('/score', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        credentials: 'include',
        body: JSON.stringify(data),
      })
    }
  }

  handleMenuClick = () => {
    this.props.changeLocation('home')
  }

  render() {
    return (
      <div>
        <p>You got...</p>
        <p>{this.props.score} out of {this.props.quizSize}</p>
        <div id="menu" className="nav btn" onClick={this.handleMenuClick}>Menu</div>
      </div>
    )
  }
}

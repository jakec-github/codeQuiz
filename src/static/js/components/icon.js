import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    changeLocation: PropTypes.func.isRequired,
  }

  handleIconClick = () => {
    if (this.props.location !== 'home') {
      this.props.changeLocation('home')
    }
  }

  render() {
    const variations = [
      '<code_quiz>', // &lt;code_quiz&gt;
      '#Code Quiz',
      '//Code Quiz',
      '[code,quiz]',
      '{code:quiz}',
      'codeQuiz',
    ]
    return (
      <h2 className="header__icon" onClick={this.handleIconClick}>{variations[Math.floor(Math.random() * 6)]}</h2>
    )
  }
}

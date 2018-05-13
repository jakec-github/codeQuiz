import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timer: PropTypes.number.isRequired,
    updateState: PropTypes.func.isRequired,
  }

  // constructor(props) {
  //   super(props)
  //
  //   this.state = {
  //     // Shouldn't be used
  //     timer: 0,
  //   }
  // }

  handleInputChange = ({ target }) => {
    this.props.updateState(target.name, target.value)
  }

  handleTimerChange = ({ target }) => {
    this.props.updateState(target.name, parseInt(target.value, 10))
  }

  render() {
    const timeLimit = this.props.timer ? `${this.props.timer} minute${this.props.timer === 1 ? '' : 's'}` : `No time limit`
    // `${this.state.timer} ${this.state.timer === 1 ? 'minute' : 'minutes'}`
    return (
      <div className="create-quiz">
        <input name="title" className="quiz-title-input" onChange={this.handleInputChange} value={this.props.title} />
        <textarea name="description" className="quiz-description-input" onChange={this.handleInputChange} value={this.props.description} />
        <p className="time-limit">{timeLimit}</p>
        <input name="timer" className="time-slider" type="range" min="0" max="30" onChange={this.handleTimerChange} value={this.props.timer} />
      </div>
    )
  }
}

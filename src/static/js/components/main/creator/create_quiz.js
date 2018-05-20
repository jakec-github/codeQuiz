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
        <input type="text" name="title" className="create-quiz__title" onChange={this.handleInputChange} value={this.props.title} placeholder="Title" />
        <textarea name="description" className="create-quiz__description" rows="4" onChange={this.handleInputChange} value={this.props.description} placeholder="A short description" />
        <p className="create-quiz__time-limit">{timeLimit}</p>
        <input name="timer" className="create-quiz__slider" type="range" min="0" max="30" onChange={this.handleTimerChange} value={this.props.timer} />
      </div>
    )
  }
}

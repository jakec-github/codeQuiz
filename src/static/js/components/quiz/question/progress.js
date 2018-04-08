import React from 'react'
import PropTypes from 'prop-types'

Progress.propTypes = {
  question: PropTypes.number.isRequired,
  quizSize: PropTypes.number.isRequired,
}

export default function Progress(props) {
  const progress = ((props.question + 1) / props.quizSize) * 100
  const style = {
    width: `${progress}%`,
  }
  return (
    <div id="total-progress">
      <div id="progress-fraction">
        <p>
          {this.props.question + 1}/{this.props.quizSize}
        </p>
      </div>
      <div id="current-progress" style={style} />
    </div>
  )
}

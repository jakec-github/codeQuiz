import React from 'react'
import PropTypes from 'prop-types'

Progress.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  questionSet: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default function Progress(props) {
  const progress = ((props.questionNumber + 1) / props.questionSet.length) * 100
  const style = {
    width: `${progress}%`,
  }
  return (
    <div className="question__progress-outer" id="total-progress">
      <div className="question__progress-score-box" id="progress-fraction">
        <p className="question__progress-score">
          {props.questionNumber + 1}/{props.questionSet.length}
        </p>
      </div>
      <div className="question__progress-inner" id="current-progress" style={style} />
    </div>
  )
}

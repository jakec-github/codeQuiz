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
    <div id="total-progress">
      <div id="progress-fraction">
        <p>
          {props.questionNumber + 1}/{props.questionSet.length}
        </p>
      </div>
      <div id="current-progress" style={style} />
    </div>
  )
}

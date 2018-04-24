import React from 'react'
import PropTypes from 'prop-types'

import Progress from '../../containers/main/question/progress'
import Code from '../../containers/main/question/code'
import Panel from '../../containers/main/question/panel'


Question.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  questionSet: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default function Question(props) {
  const next = props.questionNumber + 1 === props.questionSet.length ? 'See result' : 'Next question'
  // Currently this is defined in three separate places
  const thisQuestion = props.questionSet[props.questionNumber]
  return (
    <div className="question">
      <Progress />
      <p id="question-text">
        {props.questionSet[props.questionNumber].text}
      </p>
      { thisQuestion.codes.length === 0 ? (undefined) : (
        <Code />
      )}
      <Panel
        next={next}
      />
    </div>
  )
}

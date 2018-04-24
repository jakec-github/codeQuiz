import { connect } from 'react-redux'

import Question from '../../components/main/question'

const mapStateToProps = state => ({
  questionNumber: state.question.questionNumber,
  questionSet: state.question.questionSet,
})

export default connect(mapStateToProps, null)(Question)

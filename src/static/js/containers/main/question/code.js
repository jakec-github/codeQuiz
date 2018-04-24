import { connect } from 'react-redux'

import Code from '../../../components/main/question/code'

const mapStateToProps = state => ({
  questionNumber: state.question.questionNumber,
  questionSet: state.question.questionSet,
})

export default connect(mapStateToProps, null)(Code)

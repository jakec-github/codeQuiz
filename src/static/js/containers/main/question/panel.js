import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Panel from '../../../components/main/question/panel'
import { questionActionCreators } from '../../../reducers/question'
import { mainActionCreators } from '../../../reducers/main'

const mapStateToProps = state => ({
  questionStatus: state.main.questionStatus,
  questionNumber: state.question.questionNumber,
  questionSet: state.question.questionSet,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(Object.assign({}, questionActionCreators, mainActionCreators), dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Panel)

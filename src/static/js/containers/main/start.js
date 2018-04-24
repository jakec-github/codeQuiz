import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { questionActionCreators } from '../../reducers/question'
import { mainActionCreators } from '../../reducers/main'

import Start from '../../components/main/start'

const mapStateToProps = state => ({
  quizId: state.question.quizId,
})
const mapDispatchToProps = dispatch =>
  bindActionCreators(Object.assign({}, questionActionCreators, mainActionCreators), dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Start)

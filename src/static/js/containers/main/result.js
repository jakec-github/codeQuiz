import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { store, CHANGE_LOCATION } from '../../store'
import { mainActionCreators } from '../../reducers/main'
import Result from '../../components/main/result'

const mapStateToProps = state => ({
  userId: state.user.userId,
  loggedIn: state.user.loggedIn,
  score: state.question.score,
  quizId: state.question.quizId,
  questionSet: state.question.questionSet,
})

const mapDispatchToProps = dispatch => bindActionCreators(mainActionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Result)

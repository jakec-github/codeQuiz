import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { mainActionCreators } from '../../reducers/main'
import Created from '../../components/main/created'

const mapStateToProps = state => ({
  questions: state.creator.questions,
  quiz: state.creator.quiz,
  userId: state.user.userId,
})

const mapDispatchToProps = dispatch => bindActionCreators(mainActionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Created)

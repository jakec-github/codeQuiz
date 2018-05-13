import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { creatorActionCreators } from '../../reducers/creator'
import { mainActionCreators } from '../../reducers/main'
import Creator from '../../components/main/creator'

const mapStateToProps = state => ({
  creatorPosition: state.creator.creatorPosition,
  questions: state.creator.questions,
  quiz: state.creator.quiz,
})

const mapDispatchToProps = dispatch => bindActionCreators(
  Object.assign({}, creatorActionCreators, mainActionCreators),
  dispatch,
)


export default connect(mapStateToProps, mapDispatchToProps)(Creator)

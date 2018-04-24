import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { questionActionCreators } from '../../reducers/question'
import { mainActionCreators } from '../../reducers/main'

import Home from '../../components/main/home'

const mapStateToProps = state => ({
  userId: state.user.userId,
  loggedIn: state.user.loggedIn,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(Object.assign({}, questionActionCreators, mainActionCreators), dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)

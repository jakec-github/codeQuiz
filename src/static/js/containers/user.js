import { bindActionCreators } from 'redux'

import { connect } from 'react-redux'

// import { store, LOGIN, LOGOUT } from '../store'
import { userActionCreators } from '../reducers/user'

import User from '../components/user'

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
})

const mapDispatchToProps = dispatch => bindActionCreators(userActionCreators, dispatch)
// const mapDispatchToProps = dispatch => ({
//   handleLogin: (userId) => {
//     dispatch({ type: LOGIN, userId })
//   },
//   handleLogOut: () => {
//     dispatch({ type: LOGOUT })
//   },
// })

export default connect(mapStateToProps, mapDispatchToProps)(User)

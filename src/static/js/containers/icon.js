import { bindActionCreators } from 'redux'

import { connect } from 'react-redux'

import Icon from '../components/icon'

import { mainActionCreators } from '../reducers/main'

const mapStateToProps = state => ({
  location: state.main.location,
})

const mapDispatchToProps = dispatch => bindActionCreators(mainActionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Icon)

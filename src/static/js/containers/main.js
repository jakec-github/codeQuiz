import { connect } from 'react-redux'

import Main from '../components/main'

const mapStateToProps = state => ({
  location: state.main.location,
  questionNumber: state.question.questionNumber,
})

export default connect(mapStateToProps, null)(Main)

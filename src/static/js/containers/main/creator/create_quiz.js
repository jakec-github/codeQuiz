import { connect } from 'react-redux'

import CreateQuiz from '../../../components/main/creator/create_quiz'

const mapStateToProps = state => ({
  // Nothing to see here
})

export default connect(mapStateToProps, null)(CreateQuiz)

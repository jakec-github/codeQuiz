import { connect } from 'react-redux'

import CreateQuestion from '../../../components/main/creator/create_question'

const mapStateToProps = state => ({
  creatorPosition: state.creator.creatorPosition,
  questions: state.creator.questions,
})

export default connect(mapStateToProps, null)(CreateQuestion)

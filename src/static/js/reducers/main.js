const CHANGE_LOCATION = 'CHANGE_LOCATION'
const CHANGE_QUESTION_STATUS = 'CHANGE_QUESTION_STATUS'

export const mainActionCreators = {
  changeLocation: location => ({ type: CHANGE_LOCATION, location }),
  changeQuestionStatus: questionStatus => ({ type: CHANGE_QUESTION_STATUS, questionStatus }),
}

const initialState = {
  location: 'home',
  // Probably want to come up with better values for this one
  questionStatus: 'answers',
}

export const main = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LOCATION:
      return Object.assign({}, state, {
        location: action.location,
      })
    case CHANGE_QUESTION_STATUS:
      return Object.assign({}, state, {
        questionStatus: action.questionStatus,
      })
    default:
      return state
  }
}

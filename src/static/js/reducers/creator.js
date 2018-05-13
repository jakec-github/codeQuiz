const CHANGE_CREATOR_POSITION = 'CHANGE_CREATOR_POSITION'
const ADD_QUESTION = 'ADD_QUESTION'
const UPDATE_QUESTION = 'UPDATE_QUESTION'
const DELETE_QUESTION = 'DELETE_QUESTION'
const UPDATE_QUIZ = 'UPDATE_QUIZ'
const DELETE_QUIZ = 'DELETE_QUIZ'

export const creatorActionCreators = {
  changeCreatorPosition: creatorPosition => ({ type: CHANGE_CREATOR_POSITION, creatorPosition }),
  addQuestion: () => ({ type: ADD_QUESTION }),
  updateQuestion: (question, index) => ({ type: UPDATE_QUESTION, question, index }),
  deleteQuestion: index => ({ type: DELETE_QUESTION, index }),
  updateQuiz: quiz => ({ type: UPDATE_QUIZ, quiz }),
  deleteQuiz: () => ({ type: DELETE_QUIZ }),
}

const initialState = {
  creatorPosition: 0,
  questions: [],
  quiz: {
    title: '',
    description: '',
    timer: 0,
  },
}

export const creator = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_CREATOR_POSITION:
      return Object.assign({}, state, {
        creatorPosition: action.creatorPosition,
      })
    case ADD_QUESTION:
      return Object.assign({}, state, {
        questions: [...state.questions, {
          question: '',
          codes: [],
          code: 0,
          answer: '',
          duds: [],
          explanation: '',
        }],
      })
    case UPDATE_QUESTION:
      return Object.assign({}, state, {
        questions: [
          ...state.questions.slice(0, action.index),
          action.question,
          ...state.questions.slice(action.index + 1),
        ],
      })
    case DELETE_QUESTION:
      return Object.assign({}, state, {
        questions: [
          ...state.questions.slice(0, action.index),
          ...state.questions.slice(action.index + 1),
        ],
      })
    case UPDATE_QUIZ:
      return Object.assign({}, state, {
        quiz: action.quiz,
      })
    case DELETE_QUIZ:
      return Object.assign({}, state, {
        creatorPosition: 0,
        questions: [],
        quiz: {
          title: '',
          description: '',
          timer: 0,
        },
      })
    default:
      return state
  }
}

import { createStore, combineReducers } from 'redux'

import { main } from './reducers/main'
import { user } from './reducers/user'
import { question } from './reducers/question'

// Creates store
const rootReducer = combineReducers({
  user,
  main,
  question,
})

const store = createStore(rootReducer)

module.exports = store

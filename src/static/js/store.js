import { createStore, combineReducers } from 'redux'

import { main } from './reducers/main'
import { user } from './reducers/user'
import { question } from './reducers/question'
import { creator } from './reducers/creator'

// Creates store
const rootReducer = combineReducers({
  user,
  main,
  question,
  creator,
})

const store = createStore(rootReducer)

module.exports = store

import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

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

export const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware),
)

// module.exports = store

import 'babel-polyfill'

import { put, takeEvery, all } from 'redux-saga/effects'

function* login() {
  console.log('Login detected')
  yield
  // yield put({ type: '' })
}

function* watchLogin() {
  yield takeEvery('LOGIN', login) // Should import from ./reducers.user.js
}

function* checkSaga() {
  console.log('Saga started')
  yield
}

export default function* rootSaga() {
  yield all([
    checkSaga(),
    watchLogin(),
  ])
}

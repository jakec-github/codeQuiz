const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'

// Action creators
// Instead of using action creators I am just passing in the actions directly
// const login = userId => ({ type: LOGIN, userId })
//
// const logOut = () => ({ type: LOGOUT })
//
// const authError = () => ({ type: AUTHERROR })
//
// const authOk = () => ({ type: AUTHOK })
// ///////////////////

export const userActionCreators = {
  // handleLogin: (userId) => {
  //   console.log('User Id')
  //   console.log(userId)
  //   console.log(typeof userId)
  //   return { type: LOGIN, userId }
  // },
  handleLogin: userId => ({ type: LOGIN, userId }),
  handleLogOut: () => ({ type: LOGOUT }),
}

const initialState = {
  userId: '',
  loggedIn: false,
  loginError: false,
}

export const user = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, {
        userId: action.userId,
        loggedIn: true,
      })
    case LOGOUT:
      return Object.assign({}, state, {
        userId: '',
        loggedIn: false,
      })
    default:
      return state
  }
}

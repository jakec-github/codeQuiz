import React from 'react'
import PropTypes from 'prop-types'
import AuthError from '../common/auth_error'

Login.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleSubmitClick: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  loginError: PropTypes.bool.isRequired,
}

export default function Login({
  handleInputChange,
  handleSubmitClick,
  username,
  password,
  loginError,
}) {
  return (
    <form>
      <AuthError
        usernameLength={false}
        usernameLetters={false}
        passwordLength={false}
        passwordMatch={false}
        incorrectDetails={loginError}
      />
      <input name="username" placeholder="Username" onChange={handleInputChange} value={username} />
      <input name="password" type="password" placeholder="Password" onChange={handleInputChange} value={password} />
      <input className="submit" name="login" onClick={handleSubmitClick} type="submit" />
    </form>
  )
}

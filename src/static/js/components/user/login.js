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
      <div className="user__form-group">
        <input className="user__input" name="username" id="username" placeholder="Username" onChange={handleInputChange} value={username} />
        <label htmlFor="username" className="user__label">Username</label>
      </div>
      <div className="user__form-group">
        <input className="user__input" id="password" name="password" type="password" placeholder="Password" onChange={handleInputChange} value={password} />
        <label htmlFor="password" className="user__label">Password</label>
      </div>
      <input className="user__submit button button--nav" name="login" onClick={handleSubmitClick} type="submit" />
      <AuthError
        usernameLength={false}
        usernameLetters={false}
        passwordLength={false}
        passwordMatch={false}
        incorrectDetails={loginError}
      />
    </form>
  )
}

import React from 'react'
import PropTypes from 'prop-types'
import AuthError from '../common/auth_error'

SignUp.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleSubmitClick: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
}

export default function SignUp({
  handleInputChange,
  handleSubmitClick,
  username,
  password,
  confirmPassword,
}) {
  // Incorrect details needs to be added
  return (
    <form>
      <div className="user__form-group">
        <input className="user__input" id="username" name="username" placeholder="Username" onChange={handleInputChange} value={username} />
        <label htmlFor="username" className="user__label">Username</label>
      </div>
      <div className="user__form-group">
        <input className="user__input" id="password" name="password" type="password" placeholder="Password" onChange={handleInputChange} value={password} />
        <label htmlFor="password" className="user__label">Password</label>
      </div>
      <div className="user__form-group">
        <input className="user__input" id="confirm-password" name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleInputChange} value={confirmPassword} />
        <label htmlFor="confirm-password" className="user__label">Confirm Password</label>
      </div>
      <input className="user__submit button button--nav" name="register" onClick={handleSubmitClick} type="submit" />
      <AuthError
        usernameLength={!/^[\da-z]{6,32}$/.test(username)}
        usernameLetters={!/.*[a-z].*[a-z].*/.test(username)}
        passwordLength={!/[A-Za-z\d@$!%*#?&-]{6,32}/.test(password)}
        passwordMatch={password !== confirmPassword}
        incorrectDetails={false}
      />
    </form>
  )
}

import React from 'react'
import PropTypes from 'prop-types'
import AuthError from './auth_error'

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
      <AuthError
        usernameLength={!/^[\da-z]{6,32}$/.test(username)}
        usernameLetters={!/.*[a-z].*[a-z].*/.test(username)}
        passwordLength={!/[A-Za-z\d@$!%*#?&-]{6,32}/.test(password)}
        passwordMatch={password !== confirmPassword}
        incorrectDetails={false}
      />
      <input name="username" placeholder="Username" onChange={handleInputChange} value={username} />
      <input name="password" type="password" placeholder="Password" onChange={handleInputChange} value={password} />
      <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleInputChange} value={confirmPassword} />
      <input className="submit" name="register" onClick={handleSubmitClick} type="submit" />
    </form>
  )
}

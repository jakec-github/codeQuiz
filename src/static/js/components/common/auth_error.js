import React from 'react'
import PropTypes from 'prop-types'

AuthError.propTypes = {
  usernameLength: PropTypes.bool.isRequired,
  usernameLetters: PropTypes.bool.isRequired,
  passwordLength: PropTypes.bool.isRequired,
  passwordMatch: PropTypes.bool.isRequired,
  incorrectDetails: PropTypes.bool.isRequired,
}

export default function AuthError({
  usernameLength,
  usernameLetters,
  passwordLength,
  passwordMatch,
  incorrectDetails,
}) {
  const allGood = !usernameLength &&
                  !usernameLetters &&
                  !passwordLength &&
                  !passwordMatch &&
                  !incorrectDetails

  return (
    <div className="error u-margin-bottom-medium" id="auth-error">
      { usernameLength &&
        <p>Username must be between 6 and 32 lowercase alphanumeric characters</p>
      }
      { usernameLetters &&
        <p>Username must contain at least 2 letters</p>
      }
      { passwordLength &&
        <p>Password must be between 6 and 32 characters</p>
      }
      { passwordMatch &&
        <p>Passwords must match</p>
      }
      { incorrectDetails &&
        <p>Incorrect username or password</p>
      }
      { allGood &&
        <p>All good</p>
      }
    </div>
  )
}

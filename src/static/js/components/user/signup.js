import React from 'react'
import PropTypes from 'prop-types'

SignUp.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleSubmitClick: PropTypes.func.isRequired,
}

export default function SignUp(props) {
  return (
    <form>
      <input name="username" placeholder="Username" onChange={props.handleInputChange} />
      <input name="password" type="password" placeholder="Password" />
      <input className="submit" name="register" onClick={props.handleSubmitClick} type="submit" />
    </form>
  )
}

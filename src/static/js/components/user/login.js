import React from 'react'
import PropTypes from 'prop-types'

Login.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleSubmitClick: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default function Login(props) {
  return (
    <form>
      <input name="username" placeholder="Username" onChange={props.handleInputChange} value={props.username} />
      <input name="password" type="password" placeholder="Password" onChange={props.handleInputChange} value={props.password} />
      <input className="submit" name="login" onClick={props.handleSubmitClick} type="submit" />
    </form>
  )
}

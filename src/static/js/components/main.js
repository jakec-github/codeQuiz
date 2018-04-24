import React from 'react'
import PropTypes from 'prop-types'

import Home from '../containers/main/home'
import Start from '../containers/main/start'
import Question from '../containers/main/question'
import Result from '../containers/main/result'

Main.propTypes = {
  location: PropTypes.string.isRequired,
}

export default function Main(props) {
  return (
    <div className="App">
      { props.location === 'home' &&
        <Home />
      }
      { props.location === 'start' &&
        <Start />
      }
      { props.location === 'quiz' &&
        <Question />
      }
      { props.location === 'result' &&
        <Result />
      }
    </div>
  )
}

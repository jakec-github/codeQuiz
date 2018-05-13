import React from 'react'
import PropTypes from 'prop-types'

import Home from '../containers/main/home'
import Start from '../containers/main/start'
import Question from '../containers/main/question'
import Result from '../containers/main/result'
import Creator from '../containers/main/creator'
import Created from '../containers/main/created'

Main.propTypes = {
  location: PropTypes.string.isRequired,
}

export default function Main(props) {
  console.log(props.location)

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
      { props.location === 'creator' &&
        <Creator />
      }
      { props.location === 'created' &&
        <Created />
      }
    </div>
  )
}

import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    questionNumber: PropTypes.number.isRequired,
    questionSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      code: 0,
    }
  }

  handleTabClick = (event) => {
    console.log(event.target.dataset.value)
    const newCode = event.target.dataset.value
    if (newCode !== this.state.code) {
      this.setState({
        code: newCode,
      })
    }
  }

  render() {
    const thisQuestion = this.props.questionSet[this.props.questionNumber]
    const codes = []
    const tabs = []
    for (let i = 0; i < thisQuestion.codes.length; i += 1) {
      console.log(thisQuestion.codes[i].type)
      console.log(`i now = ${i}`)
      console.log(`this.state.code = ${this.state.code}`)
      tabs.push(<article onClick={this.handleTabClick} id={i === this.state.code ? 'selected' : 'unselected'} className="tab" data-value={i.toString()} key={i.toString()}>{thisQuestion.codes[i].type}</article>)
      codes.push(<article id={`code-${i.toString()}`} className="code-block" key={i.toString()}>{thisQuestion.codes[i].sample}</article>)
    }
    const tabsStyle = {
      gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
    }
    return (
      <article id="code">
        <div id="code-tabs" style={tabsStyle}>
          {tabs}
        </div>
        <pre id="monospace">
          <code>
            {codes[this.state.code]}
          </code>
        </pre>
      </article>
    )
  }
}

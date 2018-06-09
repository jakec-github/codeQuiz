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

  handleTabClick = ({ target: { dataset } }) => {
    console.log(dataset.value)
    const newCode = parseInt(dataset.value, 10)
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
      tabs.push((
        <article
          onClick={this.handleTabClick}
          className={i === this.state.code ? 'question__code-tab question__code-tab--selected' : 'question__code-tab question__code-tab--unselected'}
          data-value={i.toString()}
          key={i.toString()}
        >
          {thisQuestion.codes[i].type}
        </article>
      ))
      codes.push((
        <article
          id={`code-${i.toString()}`}
          className="question__code-block"
          key={i.toString()}
        >
          {thisQuestion.codes[i].sample}
        </article>
      ))
    }
    const tabsStyle = {
      gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
    }
    return (
      <article className="question__code" id="code">
        <div className="question__code-tabs" id="code-tabs" style={tabsStyle}>
          {tabs}
        </div>
        <pre className="question__monospace" id="monospace">
          <code>
            {codes[this.state.code]}
          </code>
        </pre>
      </article>
    )
  }
}

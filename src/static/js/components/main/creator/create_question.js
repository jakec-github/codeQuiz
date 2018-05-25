import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    creatorPosition: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    codes: PropTypes.arrayOf(PropTypes.object).isRequired,
    code: PropTypes.number.isRequired,
    answer: PropTypes.string.isRequired,
    duds: PropTypes.arrayOf(PropTypes.string).isRequired,
    explanation: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.object).isRequired,
    updateState: PropTypes.func.isRequired,
    changeCode: PropTypes.func.isRequired,
  }

  // constructor(props) {
  //   super(props)
  //
  //   this.state = {
  //     // question: '',
  //     // codes: [],
  //     // code: 0,
  //     // answer: '',
  //     // duds: [],
  //     // explanation: '',
  //   }
  // }

  handleInputChange = ({ target }) => {
    // console.log(this.state[target.name])
    // this.setState({
    //   [target.name]: target.value,
    // })
    this.props.updateState(target.name, target.value)
  }

  handleAddCodeChange = ({ target }) => {
    // this.setState({
    //   codes: [...this.state.codes, {
    //     language: target.value,
    //     contents: 'Your code here',
    //   }],
    // })
    this.props.updateState('codes', [...this.props.codes, {
      language: target.value,
      contents: '',
    }])
  }

  handleCodeChange = ({ target }) => {
    // const { codes } = this.state
    // codes[target.dataset.value].contents = target.value
    // this.setState({
    //   codes,
    // })
    const codes = JSON.parse(JSON.stringify(this.props.codes)) // Get a better way to do this
    codes[target.dataset.value].contents = target.value
    this.props.updateState('codes', codes)
  }

  handleAddDudClick = () => {
    // this.setState({
    //   duds: [...this.state.duds, ''],
    // })
    this.props.updateState('duds', [...this.props.duds, ''])
  }

  handleDudChange = ({ target }) => {
    // const { duds } = this.state
    // duds[target.dataset.value] = target.value
    // this.setState({
    //   duds,
    // })
    const duds = this.props.duds.slice(0)
    console.log('-----')
    console.log(duds)
    duds[target.dataset.value] = target.value
    this.props.updateState('duds', duds)
  }

  handleTabClick = (event) => {
    const newCode = parseInt(event.target.dataset.value, 10)
    if (newCode !== this.props.code) {
      this.props.changeCode(newCode)
    }
  }

  render() {
    const tabs = []
    const codeContents = []
    const duds = []
    this.props.codes.forEach((code, i) => {
      tabs.push(<article onClick={this.handleTabClick} className={i === this.props.code ? 'create-question__code-tab create-question__code-tab--selected' : 'create-question__code-tab create-question__code-tab--unselected'} data-value={i.toString()} key={i.toString()}>{code.language}</article>)
      codeContents.push(<textarea rows="12" className="create-question__code-content" data-value={i.toString()} key={i.toString()} onChange={this.handleCodeChange} value={this.props.codes[i].contents} placeholder="Paste or type your code here" />)
    })
    this.props.duds.forEach((dud, i) => {
      duds.push(<input className="create-question__choice create-question__choice--incorrect" data-value={i.toString()} key={i.toString()} placeholder="Incorrect Answer" onChange={this.handleDudChange} value={this.props.duds[i]} />)
    })
    const tabsStyle = {
      gridTemplateColumns: `repeat(${tabs.length < 3 ? tabs.length + 1 : tabs.length}, 1fr)`,
    }

    const progress = ((this.props.creatorPosition) / this.props.questions.length) * 100
    const progressStyle = {
      width: `${progress}%`,
    }
    // Potentially remove code items after they are selected
    return (
      <div className="create-question">
        <div className="question__progress-outer" id="total-progress">
          <div className="question__progress-score-box" id="progress-fraction">
            <p className="question__progress-score">
              { this.props.creatorPosition}/{this.props.questions.length}
            </p>
          </div>
          <div className="question__progress-inner" id="current-progress" style={progressStyle} />
        </div>
        <textarea name="question" rows="3" className="create-question__question u-margin-top-tiny" placeholder="Question" onChange={this.handleInputChange} value={this.props.question} />
        <article className="create-question__code" id="code-input">
          <div className="create-question__code-tabs" id="code-tabs" style={tabsStyle}>
            { tabs }
            { this.props.codes.length < 3 &&
              <select className="create-question__add-code" value="Add code" onChange={this.handleAddCodeChange}>
                <option value="Add code">Add code</option>
                <option value="html">html</option>
                <option value="css">css</option>
                <option value="javascript">javascript</option>
                <option value="python">python</option>
              </select>
            }
          </div>
          <pre id="monospace">
            { codeContents[this.props.code] }
          </pre>
        </article>
        <div className="create-question__choices">
          <input name="answer" className="create-question__choice create-question__choice--answer" onChange={this.handleInputChange} placeholder="Answer" value={this.props.answer} />
          {duds}
          { this.props.duds.length < 5 &&
            <div className="create-question__choice create-question__choice--add" onClick={this.handleAddDudClick}>
              Add incorrect answer
            </div>
          }
        </div>
        <textarea name="explanation" rows="6" className="create-question__explanation" onChange={this.handleInputChange} placeholder="Explanation" value={this.props.explanation} />
      </div>
    )
  }
}

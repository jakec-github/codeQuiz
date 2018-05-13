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
    updateState: PropTypes.func.isRequired,
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
      contents: 'Your code here',
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

  render() {
    const tabs = []
    const codeContents = []
    const duds = []
    this.props.codes.forEach((code, i) => {
      tabs.push(<article onClick={this.handleTabClick} id={i === this.props.code ? 'selected' : 'unselected'} className="tab" data-value={i.toString()} key={i.toString()}>{code.language}</article>)
      codeContents.push(<textarea className="code-input" data-value={i.toString()} key={i.toString()} onChange={this.handleCodeChange} value={this.props.codes[i].contents} />)
    })
    this.props.duds.forEach((dud, i) => {
      duds.push(<input className="dud-input" data-value={i.toString()} key={i.toString()} placeholder="Incorrect Answer" onChange={this.handleDudChange} value={this.props.duds[i]} />)
    })
    // Potentially remove code items after they are selected
    return (
      <div className="create-quiz">
        <h3 className="question-number">Question {this.props.creatorPosition}</h3>
        <textarea name="question" className="question" placeholder="question" onChange={this.handleInputChange} value={this.props.question} />
        <article id="code-input">
          <div id="code-tabs">
            { tabs }
            { this.props.codes.length < 3 &&
              <select className="add-code" value="+" onChange={this.handleAddCodeChange}>
                <option value="+">+</option>
                <option value="html">html</option>
                <option value="css">css</option>
                <option value="javascript">javascript</option>
                <option value="python">python</option>
              </select>
            }
          </div>
          <pre id="monospace">
            { codeContents }
          </pre>
        </article>
        <input name="answer" className="answer" onChange={this.handleInputChange} placeholder="Answer" value={this.props.answer} />
        {duds}
        {this.props.duds.length < 5 &&
          <div className="add-dud" onClick={this.handleAddDudClick}>
            +
          </div>
        }
        <textarea name="explanation" className="explanation" onChange={this.handleInputChange} placeholder="Explanation" value={this.props.explanation} />
      </div>
    )
  }
}

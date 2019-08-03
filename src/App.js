import React, { Component } from 'react'
import hljs from 'highlight.js'
import {
  Markup,
  Editor,
  Container,
  Column,
  Row,
  RuleInput,
  RuleLabel,
  StyleInput,
  Button,
  Document
} from './styled'

class App extends Component {
  state = {
    editor: '',
    name0: '',
    begin0: '',
    end0: '',
    style0: '',
    rules: 1
  }

  handleChange = event => {
    let { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  rules = () => {
    let { rules } = this.state
    let array = []
    let fields = ['name', 'begin', 'end']
    for (let i = 0; i < rules; i++) {
      array.push(
        <Row key={i}>
          <Column>
            {fields.map((field, index) => {
              return (
                <Column key={index}>
                  <RuleLabel>{field}</RuleLabel>
                  <RuleInput
                    value={this.state[`${field}${i}`]}
                    onChange={this.handleChange}
                    name={`${field}${i}`}
                  />
                </Column>
              )
            })}
          </Column>
          <StyleInput
            value={this.state[`style${i}`]}
            onChange={this.handleChange}
            name={`style${i}`}
          />
        </Row>
      )
    }

    return array
  }

  newFields = () => {
    this.setState(prevState => {
      let { rules } = prevState
      let fields = ['name', 'begin', 'end', 'style']
      let inputValues = {}
      fields.forEach(field => {
        inputValues = {
          ...inputValues,
          [`${field}${rules}`]: ''
        }
      })
      rules++
      return {
        rules,
        ...inputValues
      }
    })
  }

  convertToMarkup = (text = '') => {
    return {
      __html: hljs.highlightAuto(text).value
    }
  }

  language = newRules => {
    return () => ({
      contains: [...newRules]
    })
  }

  registerLanguage = state => {
    let { rules } = state
    let ruleObjects = []
    for (let i = 0; i < rules; i++) {
      let newRule = {
        className: state[`name${i}`],
        begin: state[`begin${i}`],
        end: state[`end${i}`]
      }
      let { className, begin, end } = newRule
      if (className.length > 1 && begin.length > 1 && end.length > 1) {
        begin = new RegExp(begin)
        end = new RegExp(end)
        ruleObjects.push(newRule)
      }
    }
    hljs.registerLanguage('language', this.language(ruleObjects))
    hljs.configure({
      languages: ['language']
    })
  }

  componentWillUpdate(nextProps, nextState) {
    this.registerLanguage(nextState)
  }

  render() {
    let { editor } = this.state
    let { handleChange, newFields, rules, convertToMarkup } = this
    return (
      <div>
        <Container>
          <Column>
            {rules()}
            <Button onClick={newFields}>New Rule</Button>
          </Column>
          <Column>
            <Button>
              Random Text
              <Document>
                <Editor
                  name={'Editor'}
                  value={editor}
                  onChange={handleChange}
                />
                <Markup dangerouslySetInnerHTML={convertToMarkup(editor)} />
              </Document>
            </Button>
          </Column>
        </Container>
      </div>
    )
  }
}

export default App

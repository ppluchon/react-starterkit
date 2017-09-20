import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './_index.scss'

export default class App extends Component {

  static propTypes = {
    text: PropTypes.string
  }

  static defaultProps = {
    text: 'Hello World'
  }

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="app-container">{this.props.text}</div>
    )
  }
}

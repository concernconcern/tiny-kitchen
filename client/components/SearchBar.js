import React from 'react';
import { SearchInput } from './styled-components'
import * as action from '../store'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import SearchBar from 'material-ui-search-bar'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.props.newInput(event);
  }
  render() {
    return (<SearchBar
      onRequestSearch={() => console.log("searching")}
      onChange={this.handleChange} />)
  }
}

const mapState = (state) => {
  return {
    recipes: state.recipes
  }
}

const mapDispatch = (dispatch) => {
  return {
    newInput: input => dispatch(action.newInput(input)),
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Search))
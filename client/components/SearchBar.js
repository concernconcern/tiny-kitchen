import React from 'react';
import { SearchInput } from './styled-components'
import * as action from '../store'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import SearchBar from 'material-ui-search-bar'
import history from '../history'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    const pathname = this.props.location.pathname;
    if (pathname !== '/' && !pathname.startsWith('/home')) history.push('/')
    this.props.newInput(event);
  }
  render() {
    return (<SearchBar style={{ margin: "10px" }}
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
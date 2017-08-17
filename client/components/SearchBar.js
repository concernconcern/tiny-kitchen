import React from 'react';
import { SearchInput } from './styled-components'
import * as action from '../store'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'


class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    this.props.newInput(event.target.value);
    this.props.searchDb(event.target.value);
  }
  render(){
    return (<SearchInput onChange={this.handleChange}/>)
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
    searchDb: input => dispatch(action.searchDb(input))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(SearchBar))
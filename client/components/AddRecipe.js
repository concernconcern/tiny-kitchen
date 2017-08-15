import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, RecipeText, Title, List } from './styled-components'
import * as action from '../store'
const AddRecipe = (props) => {
  console.log(props)
  return <h1> Hi </h1>
}

export default AddRecipe;
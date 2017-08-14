import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, RecipeText, Title, List } from './styled-components'
import * as action from '../store'

class ViewRecipe extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.match.params.id)
    this.props.getRecipe(this.props.match.params.id);
  }

  render() {
    const recipe = this.props.recipe;
    console.log(recipe);
    return (
      <Wrapper >
        <RecipeImg src="https://nytimes.com/images/2017/08/16/dining/16pairingweb/16pairingweb-articleLarge.jpg" />
        <RecipeText>
          <Title>{recipe && recipe.title}</Title>
          {/* <List>
            {recipe && recipe.ingredients.map(ingredient => {
              return <li>{ingredient}</li>
            })}</List>
          <List>
            {recipe && recipe.directions.map(direction => {
              return <li>{direction}</li>
            })}</List> */}
        </RecipeText>
      </Wrapper>
    )
  }
}
/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    recipe: state.recipe
  }
}

const mapDispatch = (dispatch) => {
  return {
    getRecipe: id => dispatch(action.getRecipe(id))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ViewRecipe))

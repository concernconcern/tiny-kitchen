import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, Tiles, TileLink } from './styled-components'
import Tile from './Tile'
import * as action from '../store'

class AllRecipes extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getRecipes();
    this.props.isCooking(false);
  }

  filterRecipes = (recipes, input) => {
    input = input.toLowerCase();
    return recipes.filter(recipe => {
      return recipe.title.toLowerCase().includes(input) ||
        recipe.directions.join().toLowerCase().includes(input) ||
        recipe.ingredients.join().toLowerCase().includes(input)
    })
  }
  getUrl = (recipeId, userId, title) => {
    return recipeId == 1 ? `/recipe/${recipeId}/cook` : userId ? `/recipe/${recipeId}/user/${userId}` : `/recipe/${recipeId}`
  }
  render() {
    let { input, recipes, isLoggedIn, userId } = this.props;
    recipes = this.filterRecipes(recipes, this.props.input);
    return (
      <Wrapper>
        {
          input.length && !recipes.length ? <Wrapper centered height><h3>No recipes found</h3></Wrapper> :
            <Tiles>
              {
                recipes.length && recipes.map((recipe, i) =>
                  <TileLink key={i} to={this.getUrl(recipe.id, userId, recipe.title)}>
                    <Tile recipe={recipe} isWelcome={recipe.id == 1} />
                  </TileLink>
                )
              }
            </Tiles>
        }
      </Wrapper>

    )
  }
}
/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    recipes: state.recipes,
    input: state.input,
    isLoggedIn: !!state.user.id,
    userId: state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    getRecipes: id => dispatch(action.getRecipes()),
    isCooking: bool => dispatch(action.getCooking(bool))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(AllRecipes))

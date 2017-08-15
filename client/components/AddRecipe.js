import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, RecipeText, Title, List, Input, Box, TextArea } from './styled-components'
import * as action from '../store'


class AddRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.chromeRecipe(this.props.location.search.slice(1));
  }
  handleChange(evt) {
    if (evt.target.id === "ingredients") {
      let ingredients = this.props.recipe.ingredients;
      ingredients[evt.target.name] = evt.target.value;
      let recipe = Object.assign({}, this.props.recipe, { ingredients })
      this.props.getRecipeSuccess(recipe)
    } else if (evt.target.id === "directions") {
      let directions = this.props.recipe.directions;
      directions[evt.target.name] = evt.target.value;
      let recipe = Object.assign({}, this.props.recipe, { directions })
      this.props.getRecipeSuccess(recipe)
    } else {
      let recipe = Object.assign({}, this.props.recipe, { title: evt.target.value });
      this.props.getRecipeSuccess(recipe)
    }
  }
  render() {
    let recipe = this.props.recipe;
    return (
      <form>
        <Input title type="text" name="title" onChange={this.handleChange} value={recipe && recipe.title} />
        <Wrapper>
          <Box>
            <Title secondary>Ingredients</Title> {recipe.ingredients &&
              recipe.ingredients.map((ingredient, i) =>
                <Input type="text" key={i} name={i} id="ingredients" value={ingredient} onChange={this.handleChange} />
              )}
          </Box>
          <Box>
            <Title secondary>Directions</Title> {recipe.directions &&
              recipe.directions.map((direction, i) =>
                <TextArea type="text" key={i} name={i} id="directions" value={direction} onChange={this.handleChange} />
              )}
          </Box>
        </Wrapper>
      </form>
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
    chromeRecipe: id => dispatch(action.chromeRecipe(id)),
    getRecipeSuccess: (recipe) => dispatch(action.getRecipeSuccess(recipe))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(AddRecipe))

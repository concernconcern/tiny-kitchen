import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, SecondaryWrap, Button, RecipeImg, RecipeText, Form, Title, List, Input, Box, TextArea } from './styled-components'
import * as action from '../store'


class AddRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    this.props.chromeRecipe(this.props.location.search.slice(5));
  }
  handleChange(evt) {
    let recipe = Object.assign({}, this.props.recipe);
    if (evt.target.name === "title") recipe.title = evt.target.value;
    else recipe[evt.target.name][evt.target.id] = evt.target.value;
    this.props.getRecipeSuccess(recipe)
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.submitRecipe(this.props.recipe)
  }
  render() {
    let recipe = this.props.recipe;
    console.log(recipe)
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input title type="text" name="title" onChange={this.handleChange} value={recipe && recipe.title} />
        <RecipeImg secondary src={recipe.picture_url} />
        <SecondaryWrap>
          <Box>
            <Title secondary>Ingredients</Title> {recipe.ingredients &&
              recipe.ingredients.map((ingredient, i) =>
                <Input type="text" key={i} id={i} name="ingredients" value={ingredient} style={{ height: "auto" }} onChange={this.handleChange} />
              )}
          </Box>
          <Box>
            <Title secondary>Directions</Title> {recipe.directions &&
              recipe.directions.map((direction, i) =>
                <TextArea type="text" key={i} id={i} name="directions" value={direction} onChange={this.handleChange} />
              )}
          </Box>
        </SecondaryWrap>
        <Button type="submit">Add Recipe</Button>
      </Form>
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
    getRecipeSuccess: (recipe) => dispatch(action.getRecipeSuccess(recipe)),
    submitRecipe: (recipe) => dispatch(action.submitRecipe(recipe))
  }
}
// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(AddRecipe))

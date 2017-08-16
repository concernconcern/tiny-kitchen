import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, SecondaryWrap, Button, Modify, RecipeImg, RecipeText, Form, Title, List, Input, Box, TextArea } from './styled-components'
import * as action from '../store'


class AddRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addField = this.addField.bind(this);
    this.deleteField = this.deleteField.bind(this);
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
  addField(e) {
    e.preventDefault();
    let recipe = Object.assign({}, this.props.recipe);
    recipe[e.target.name] = [...recipe[e.target.name], `New ${e.target.name.slice(0, -1)}`];
    this.props.getRecipeSuccess(recipe)
  }
  deleteField(e) {
    e.preventDefault();
    let recipe = Object.assign({}, this.props.recipe);
    recipe[e.target.name].splice(+e.target.id, 1);
    this.props.getRecipeSuccess(recipe)
  }
  render() {
    let recipe = this.props.recipe;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input title type="text" name="title" onChange={this.handleChange} value={recipe && recipe.title} />
        <RecipeImg secondary src={recipe.picture_url} />
        <SecondaryWrap>
          <Box>
            <Title secondary>Ingredients</Title> {
              recipe.ingredients.map((ingredient, i) =>
              { return (<div><Modify x href="#" onClick={this.deleteField} name="ingredients" id={i}>x</Modify> <Input type="text" key={i} id={i} name="ingredients" value={ingredient} style={{ height: "auto" }} onChange={this.handleChange} /></div>) })}
            <Modify href="#" onClick={this.addField} name="ingredients">+</Modify>
          </Box>
          <Box>
            <Title secondary>Directions</Title> {
              recipe.directions.map((direction, i) =>
              { return (<div><Modify x href="#" onClick={this.deleteField} name="directions" id={i}>x</Modify>  <TextArea type="text" key={i} id={i} name="directions" value={direction} onChange={this.handleChange} /></div>) })
            }
            <Modify href="#" onClick={this.addField} name="directions">+</Modify>
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

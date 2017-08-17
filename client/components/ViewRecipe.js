import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, ControlPanel, TextArea, RecipeText, Notes, Title, List } from './styled-components'
import * as action from '../store'

class ViewRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      notes: ''
    }
    this.editing = this.editing.bind(this)
    this.cancel = this.cancel.bind(this)
    this.handleNote = this.handleNote.bind(this)
    this.handleSave = this.handleSave.bind(this)

  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.recipeid);
    this.props.isCooking(false);
    this.props.getRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
  }

  editing() {
    this.setState({
      editing: true,
      notes: this.props.recipebox.notes
    })
  }
  cancel(e) {
    e.preventDefault()
    this.setState({
      editing: false
    })
  }
  handleNote(e) {
    this.setState({
      notes: e.target.value
    })
  }
  handleSave(e) {
    e.preventDefault()
    this.setState({
      editing: false
    })
    this.props.saveNote(this.props.match.params.userid, this.props.match.params.recipeid, { notes: this.state.notes })
  }
  render() {
    const { recipe } = this.props;
    return (
      <Wrapper >
        <RecipeImg src={recipe.picture_url} />
        <RecipeText>

          <Title>{recipe && recipe.title}</Title>
          <ControlPanel>
            <Link to={`/recipe/${recipe.id}/cook`} alt="Cook Recipe" className="btn btn-info btn-lg">
              <span className="glyphicon glyphicon-play" />
            </Link>
            {this.props.recipebox ?
              <a href="#edit" alt="Add Notes" onClick={this.editing} className="btn btn-info btn-lg">
                <span className="glyphicon glyphicon-pencil" />
              </a>
              :
              <Link to={`/recipe/${recipe.id}/cook`} alt="Add to RecipeBox" className="btn btn-info btn-lg">
                <span className="glyphicon glyphicon-plus" />
              </Link>
            }
          </ControlPanel>
          <Title secondary>Ingredients</Title>
          <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </List>
          <Title secondary>Directions</Title>
          <List directions>
            {recipe.directions && recipe.directions.map((direction, i) => <li key={i}>{direction}</li>)}
          </List>
          {/*/ Render if there is a recipebox, render textarea if in editing mode/*/}
          {this.props.recipebox ?
            <div> <Title secondary>My Notes</Title>
              {this.state.editing ?
                <Notes>
                  <TextArea id="edit" value={this.state.notes} onChange={this.handleNote}></TextArea>
                  <a href="#" alt="Save Note" onClick={this.handleSave} className="btn btn-info btn-lg">
                    <span className="glyphicon glyphicon-ok" />
                  </a>
                  <a href="#" alt="Cook Recipe" onClick={this.cancel} className="btn btn-info btn-lg">
                    <span className="glyphicon glyphicon-remove" />
                  </a>
                </Notes>
                :
                <Notes>{this.props.recipebox.notes}</Notes>
              }   </div> : ''}
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
    recipe: state.recipe,
    recipebox: state.recipebox,
    user: state.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    getRecipe: id => dispatch(action.getRecipe(id)),
    getRecipeBox: (userId, recipeId) => dispatch(action.getRecipeBox(userId, recipeId)),
    isCooking: bool => dispatch(action.getCooking(bool)),
    saveNote: (userId, recipeId, note) => dispatch(action.editRecipeBox(userId, recipeId, note))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ViewRecipe))

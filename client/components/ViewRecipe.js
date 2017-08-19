import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, ControlPanel, Message, AccentButton, TextArea, RecipeText, Notes, Title, List } from './styled-components'
import history from '../history'
import * as action from '../store'
import Mochi from '../mochi'

class ViewRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      notes: '',
      success: false
    }
    this.editing = this.editing.bind(this)
    this.cancel = this.cancel.bind(this)
    this.handleNoteChange = this.handleNoteChange.bind(this)
    this.handleSaveNote = this.handleSaveNote.bind(this)
    this.handleCreateRecipeBox = this.handleCreateRecipeBox.bind(this)
    this.handleRemoveRecipeBox = this.handleRemoveRecipeBox.bind(this)
    this.handleAddGrocery = this.handleAddGrocery.bind(this)
  }

  componentDidMount() {
    Mochi.shutUp();
    this.props.getRecipe(this.props.match.params.recipeid);
    this.props.isCooking(false);
    this.props.getRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid);
    this.props.isLoggedIn ? history.push(`/recipe/${this.props.match.params.recipeid}/user/${this.props.user.id}`) : ''
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
  handleNoteChange(e) {
    this.setState({
      notes: e.target.value
    })
  }
  handleSaveNote(e) {
    e.preventDefault()
    this.setState({
      editing: false
    })
    this.props.saveNote(this.props.match.params.userid, this.props.match.params.recipeid, { notes: this.state.notes })
  }
  handleCreateRecipeBox(e) {
    e.preventDefault()
    this.props.createRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
    this.setState({
      success: true
    })
  }
  handleRemoveRecipeBox(e) {
    e.preventDefault()
    this.props.removeRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
  }
  handleAddGrocery(e) {
    this.props.reallyAddGrocery(this.props.match.params.userid, e.target.value)
  }

  render() {
    const { recipe, recipebox, isLoggedIn } = this.props;

    return (
      <Wrapper >
        <RecipeImg src={recipe.picture_url} />
        <RecipeText>
          <Title>{recipe && recipe.title}</Title>
          {isLoggedIn ? <ControlPanel>
            <a href={`/recipe/${recipe.id}/cook`} ><AccentButton alt="Cook Recipe" >
              <span className="glyphicon glyphicon-play" />
            </AccentButton></a>&nbsp;&nbsp;
            {recipebox && recipebox.hasOwnProperty("notes") ?
              <div style={{ display: "flex" }}>
                <a href="#edit">
                  <AccentButton alt="Add Notes" onClick={this.editing} >
                    <span className="glyphicon glyphicon-pencil" />
                  </AccentButton>
                </a> &nbsp;&nbsp;
                <a href="#edit">
                  <AccentButton alt="Remove from RecipeBox" onClick={this.handleRemoveRecipeBox} >
                    <span className="glyphicon glyphicon-remove" />
                  </AccentButton>
                </a>&nbsp;&nbsp;
                {this.state.success ? <Message style={{ padding: "15px 20px", margin: "0" }}>Added to your recipe box!</Message> : ''}
              </div>
              :
              <AccentButton href="#" alt="Add to RecipeBox" onClick={this.handleCreateRecipeBox} >
                <span className="glyphicon glyphicon-plus" />
              </AccentButton>
            }
          </ControlPanel> : ''
          }
          <Title secondary>Ingredients</Title>
          <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i.toString()}>{ingredient}<button type="button" className="btn btn-default btn-sm" onClick={this.handleAddGrocery} value={ingredient}>
          <span className="glyphicon glyphicon-plus"></span></button></li>)}
          </List>
          <Title secondary>Directions</Title>
          <List directions>
            {recipe.directions && recipe.directions.map((direction, i) => <li key={i}>{direction}</li>)}
          </List>
          {/*/ Render if there is a recipebox, render textarea if in editing mode/*/}
          {
            recipebox && recipebox.hasOwnProperty("notes") ?
              <div> <Title secondary>My Notes</Title>
                {this.state.editing ?
                  <Notes>
                    <TextArea id="edit" value={this.state.notes} onChange={this.handleNoteChange}></TextArea>
                    <div><AccentButton href="#" alt="Save Note" onClick={this.handleSaveNote}>
                      <span className="glyphicon glyphicon-ok" />
                    </AccentButton>&nbsp;&nbsp;
                    <AccentButton href="#" alt="Cook Recipe" onClick={this.cancel}>
                        <span className="glyphicon glyphicon-remove" />
                      </AccentButton>
                    </div>
                  </Notes>
                  :
                  <Notes>{this.props.recipebox.notes}</Notes>
                }   </div> : ''
          }
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
    isLoggedIn: !!state.user.id,
    user: state.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    getRecipe: id => dispatch(action.getRecipe(id)),
    getRecipeBox: (userId, recipeId) => dispatch(action.getRecipeBox(userId, recipeId)),
    createRecipeBox: (userId, recipeId) => dispatch(action.addRecipeBox(userId, recipeId)),
    isCooking: bool => dispatch(action.getCooking(bool)),
    saveNote: (userId, recipeId, note) => dispatch(action.editRecipeBox(userId, recipeId, note)),
    removeRecipeBox: (userId, recipeId) => dispatch(action.removeRecipeBox(userId, recipeId)),
    reallyAddGrocery: (userId, ingredientText) => dispatch(action.reallyAddGrocery(userId, ingredientText))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ViewRecipe))

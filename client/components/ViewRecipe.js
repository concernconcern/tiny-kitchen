import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, ControlPanel, AccentButton, TextArea, RecipeText, Notes, Title, List } from './styled-components'
import history from '../history'
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
    this.handleCreateRecipeBox = this.handleCreateRecipeBox.bind(this)
  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.recipeid);
    this.props.isCooking(false);

    this.props.isLoggedIn ? history.push(`/recipe/${this.props.match.params.recipeid}/user/${this.props.user.id}`) : ''
    this.props.isLoggedIn ? this.props.getRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid) : ''
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
  handleCreateRecipeBox(e) {
    e.preventDefault()
    this.props.createRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
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
            {this.props.recipebox.hasOwnProperty("notes") ?
              <a href="#edit"><AccentButton alt="Add Notes" onClick={this.editing} >
                <span className="glyphicon glyphicon-pencil" />
              </AccentButton></a>
              :
              <AccentButton href="#" alt="Add to RecipeBox" onClick={this.handleCreateRecipeBox} >
                <span className="glyphicon glyphicon-plus" />
              </AccentButton>
            }
          </ControlPanel> : ''}
          <Title secondary>Ingredients</Title>
          <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </List>
          <Title secondary>Directions</Title>
          <List directions>
            {recipe.directions && recipe.directions.map((direction, i) => <li key={i}>{direction}</li>)}
          </List>
          {/*/ Render if there is a recipebox, render textarea if in editing mode/*/}
          {isLoggedIn && recipebox.hasOwnProperty("notes") ?
            <div> <Title secondary>My Notes</Title>
              {this.state.editing ?
                <Notes>
                  <TextArea id="edit" value={this.state.notes} onChange={this.handleNote}></TextArea>
                  <div><AccentButton href="#" alt="Save Note" onClick={this.handleSave}>
                    <span className="glyphicon glyphicon-ok" />
                  </AccentButton>&nbsp;&nbsp;
                    <AccentButton href="#" alt="Cook Recipe" onClick={this.cancel}>
                      <span className="glyphicon glyphicon-remove" />
                    </AccentButton>
                  </div>
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
    saveNote: (userId, recipeId, note) => dispatch(action.editRecipeBox(userId, recipeId, note))

  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ViewRecipe))

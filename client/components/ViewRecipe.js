import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, ControlPanel, Message, AccentButton, TextArea, RecipeText, Notes, Title, List } from './styled-components'
import history from '../history'
import * as action from '../store'
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import NotesModal from './NotesModal';

class ViewRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      open: false,
      message: ''
    }
    this.handleCreateRecipeBox = this.handleCreateRecipeBox.bind(this)
    this.handleRemoveRecipeBox = this.handleRemoveRecipeBox.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.recipeid);
    this.props.isCooking(false);
    if (this.props.user.id) {
      history.push(`/recipe/${this.props.match.params.recipeid}/user/${this.props.user.id}`);
      this.props.getRecipeBox(this.props.user.id, this.props.match.params.recipeid)
    }
  }

  handleCreateRecipeBox(e) {
    e.preventDefault()
    this.props.createRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
    this.setState({
      open: true,
      message: 'Added to your Recipe Box'
    })
  }
  handleRemoveRecipeBox(e) {
    e.preventDefault()
    this.setState({
      open: true,
      message: 'Removed from your Recipe Box'
    })
    this.props.removeRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

<<<<<<< HEAD
  handleAddGrocery(ingredient, e) {
    this.props.reallyAddGrocery(this.props.match.params.userid, ingredient)
=======
  handleAddGrocery(e) {
    // console.log(e.target.value);
    this.props.reallyAddGrocery(this.props.match.params.userid, e.target.value)
>>>>>>> 57eb7215ad16578b311fefe58e5088e7c1439feb
  }


  render() {
    const { recipe, recipebox, isLoggedIn } = this.props;

    return (
      <Wrapper >
        <RecipeImg src={recipe.picture_url} />
        <RecipeText>
          <Title>{recipe && recipe.title}</Title>
          {isLoggedIn ?
            <ControlPanel style={{ padding: "0" }}>
              <a href={`/recipe/${recipe.id}/cook`} >
                <IconButton
                  iconStyle={{ fontSize: "45px", color: "#59a5f6" }}
                  iconClassName="material-icons"
                  tooltip="Cooking Mode"
                  tooltipPosition="bottom-right">
                  play_circle_outline
                </IconButton>
              </a>&nbsp;&nbsp;
            {recipebox && recipebox.hasOwnProperty("notes") ?
                <div style={{ display: "flex" }}>
                  <a href="#" onClick={this.handleRemoveRecipeBox} >
                    <IconButton
                      iconStyle={{ fontSize: "45px", color: "#59a5f6" }}
                      iconClassName="material-icons"
                      tooltip="Remove from Recipe Box"
                      tooltipPosition="bottom-right">
                      remove_circle_outline
              </IconButton>
                  </a>
                </div>
                :
                <a href="#" onClick={this.handleCreateRecipeBox}>
                  <IconButton
                    iconStyle={{ fontSize: "45px", color: "#59a5f6" }}
                    iconClassName="material-icons"
                    tooltip="Add to Box"
                    tooltipPosition="bottom-right">
                    playlist_add
                </IconButton>
                </a>

              }

            </ControlPanel> : ''
          }
          {/*/ Render if there is a recipebox, render textarea if in editing mode/*/}
          {
            recipebox && recipebox.hasOwnProperty("notes") ?
              <div><div style={{ display: "flex", alignItems: "center" }}> <Title secondary>My Notes
              </Title>
                <NotesModal
                  notes={this.props.recipebox.notes}
                  user={this.props.match.params.userid}
                  recipe={this.props.match.params.recipeid}
                  saveNote={this.props.saveNote} />
              </div>

                <Notes>{this.props.recipebox.notes}</Notes>
              </div> : ''
          }
          <Title secondary>Ingredients</Title>
          <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) =>
<<<<<<< HEAD
              <li key={i.toString()}>{ingredient}
                <IconButton
                  style={{ width: "28px", height: "28px" }}
                  iconStyle={{ fontSize: "20px", color: "#59a5f6" }}
                  iconClassName="material-icons"
                  tooltip="Add Grocery"
                  tooltipPosition="bottom-right"
                  onClick={this.handleAddGrocery.bind(this, ingredient)}
                >
                  add
                  </IconButton>
=======
              <li key={i.toString()}>
              {ingredient}
                <button type="button" className="btn btn-default btn-sm" onClick={this.handleAddGrocery} value={ingredient}>
                  <span className="glyphicon glyphicon-plus"></span>
                </button>
>>>>>>> 57eb7215ad16578b311fefe58e5088e7c1439feb
              </li>)}
          </List>
          <Title secondary>Directions</Title>
          <List directions>
            {recipe.directions && recipe.directions.map((direction, i) => <li key={i}>{direction}</li>)}
          </List>
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
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
    removeRecipeBox: (userId, recipeId) => dispatch(action.removeRecipeBox(userId, recipeId)),
    isCooking: bool => dispatch(action.getCooking(bool)),
    saveNote: (userId, recipeId, note) => dispatch(action.editRecipeBox(userId, recipeId, note)),
    reallyAddGrocery: (userId, ingredientText) => dispatch(action.reallyAddGrocery(userId, ingredientText))

  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ViewRecipe))

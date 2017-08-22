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
      message: '',
      showGrocery: false
    }
  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.recipeid);
    this.props.isCooking(false);
    if (this.props.user.id) {
      history.push(`/recipe/${this.props.match.params.recipeid}/user/${this.props.user.id}`);
      this.props.getRecipeBox(this.props.user.id, this.props.match.params.recipeid)
    }
  }

  componentWillUnmount() {
    this.props.resetRecipe();
  }

  handleCreateRecipeBox = (e) => {
    e.preventDefault()
    this.props.createRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
    this.setState({
      open: true,
      message: 'Added to your Recipe Box'
    })
  }
  handleRemoveRecipeBox = (e) => {
    e.preventDefault()
    this.setState({
      open: true,
      showGrocery: false,
      message: 'Removed from your Recipe Box'
    })
    this.props.removeRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  handleAddGrocery = (ingredient, e) => {
    this.props.reallyAddGrocery(this.props.match.params.userid, ingredient)
    this.setState({
      open: true,
      message: `${ingredient} was added to your grocery list!`
    })
  }


  render() {
    const { recipe, recipebox, isLoggedIn } = this.props;
    const controlPanel = { fontSize: "45px", color: "#59a5f6" };
    return (
      <Wrapper >
        <RecipeImg src={recipe.picture_url} />
        <RecipeText>
          <Title>{recipe && recipe.title}</Title>
          {isLoggedIn ?
            <ControlPanel style={{ padding: "0px" }}>
              <a href={`/recipe/${recipe.id}/cook`} >
                <IconButton
                  iconStyle={controlPanel}
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
                      iconStyle={controlPanel}
                      iconClassName="material-icons"
                      tooltip="Remove from Recipe Box"
                      tooltipPosition="bottom-right">
                      remove_circle_outline
              </IconButton>
                  </a>&nbsp;&nbsp;
                  <a href="#" onClick={() => this.setState({ showGrocery: !this.state.showGrocery })}>
                    <IconButton
                      iconStyle={controlPanel}
                      iconClassName="material-icons"
                      tooltip="Toggle Grocery Mode"
                      tooltipPosition="bottom-right">
                      add_shopping_cart
                </IconButton>
                  </a>
                </div>
                :
                <a href="#" onClick={this.handleCreateRecipeBox}>
                  <IconButton
                    iconStyle={controlPanel}
                    iconClassName="material-icons"
                    tooltip="Add to Box"
                    tooltipPosition="bottom-right">
                    add
                </IconButton>
                </a>

              }

            </ControlPanel> : ''
          }
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
              <li style={{ display: "flex", left: "0" }} key={i.toString()}>
                {isLoggedIn & this.state.showGrocery ?
                  <IconButton
                    style={{ width: "20px", height: "20px", padding: "0", margin: "0 10px" }}
                    iconStyle={{ fontSize: "20px", color: "#59a5f6", padding: "0" }}
                    iconClassName="material-icons"
                    tooltip="Add Grocery"
                    tooltipPosition="bottom-right"
                    onClick={this.handleAddGrocery.bind(this, ingredient)}
                  >
                    add
                </IconButton> : <span> - &nbsp;&nbsp;</span>
                }
                {ingredient}
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
      </Wrapper >
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
    removeRecipeBox: (userId, recipeId) => dispatch(action.removeRecipeBox(userId, recipeId)),
    reallyAddGrocery: (userId, ingredientText) => dispatch(action.reallyAddGrocery(userId, ingredientText)),
    resetRecipe: () => dispatch(action.resetRecipe())
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ViewRecipe))

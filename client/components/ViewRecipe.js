import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, ControlPanel, Message, AccentButton, Button, TextArea, RecipeText, Notes, Title, List } from './styled-components'
import history from '../history'
import * as action from '../store'
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import NotesModal from './NotesModal';

class ViewRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: false,
      open: false,
      message: '',
      showGrocery: false
    }
  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.recipeid);
    this.props.isCooking(false);
    if (this.props.match.params.userid) this.props.getRecipeBox(this.props.match.params.userid, this.props.match.params.recipeid)
  }
  componentWillReceiveProps(props) {
    props.user.id == this.props.match.params.userid ? this.setState({ permissions: true }) : ''
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
    const { recipe, recipebox, isLoggedIn, user } = this.props;
    const { permissions } = this.state;
    const controlPanel = { fontSize: "45px", color: "#59a5f6" };

    return (
      <Wrapper >
        <RecipeImg src={recipe.picture_url} />
        <RecipeText>
          <Title><a href={recipe.source_url} target="_blank" style={{ color: "black", textDecoration: "none" }}>{recipe && recipe.title}</a></Title>
          <ControlPanel style={{ padding: "0px" }}>
            <Link to={`/recipe/${recipe.id}/cook`} >
              <IconButton
                touch
                iconStyle={controlPanel}
                iconClassName="material-icons"
                tooltip="Cooking Mode"
                tooltipPosition="top-right">
                play_circle_outline
                </IconButton>
            </Link>&nbsp;&nbsp;
              {recipebox && recipebox.hasOwnProperty("notes") ?
              <div>
                <IconButton
                  touch
                  onClick={this.handleRemoveRecipeBox}
                  iconStyle={controlPanel}
                  iconClassName="material-icons"
                  tooltip="Remove from Recipe Box"
                  tooltipPosition="top-right">
                  remove_circle_outline
                    </IconButton>
                &nbsp;&nbsp;
                  <IconButton
                  touch
                  iconStyle={controlPanel}
                  iconClassName="material-icons"
                  tooltip="Toggle Grocery Mode"
                  tooltipPosition="top-right"
                  onClick={() => this.setState({ showGrocery: !this.state.showGrocery })}
                >
                  add_shopping_cart
                </IconButton>
              </div>
              :
              <div>
                <IconButton
                  touch
                  disabled={!isLoggedIn}
                  iconStyle={controlPanel}
                  iconClassName="material-icons"
                  tooltip={!isLoggedIn ? 'Login to add to your recipes!' : 'Add To Recipe Box'}
                  onClick={this.handleCreateRecipeBox}
                  tooltipPosition="top-right">
                  add
                </IconButton>
              </div>
            }

          </ControlPanel>
          {
            recipebox && recipebox.hasOwnProperty("notes") ?
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Title secondary>Notes</Title>
                  {permissions ? <NotesModal
                    notes={this.props.recipebox.notes}
                    user={this.props.match.params.userid}
                    recipe={this.props.match.params.recipeid}
                    saveNote={this.props.saveNote} /> : null}
                </div>
                <Notes>{this.props.recipebox.notes}</Notes>
              </div> : null
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
                    onClick={this.handleAddGrocery.bind(this, ingredient)}>
                    add
                </IconButton> : <span style={{ padding: "0 15px" }}> -</span>
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

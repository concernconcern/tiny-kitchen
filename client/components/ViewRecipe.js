import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, RecipeImg, RecipeText, Title, List } from './styled-components'
import * as action from '../store'

class ViewRecipe extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.id);
  }

  render() {
    const {recipe, handleClick} = this.props;
    console.log(recipe);
    return (
      <Wrapper >
        <RecipeImg src={recipe.picture_url} />
        <RecipeText>

          <Title>{recipe && recipe.title}
            &nbsp; &nbsp;
             <Link to={`/recipe/${recipe.id}/cook`} className="btn btn-info btn-lg" onClick={handleClick}>
              <span className="glyphicon glyphicon-play" />
            </Link>

          </Title>
          <Title secondary>Ingredients</Title>
          <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </List>
          <Title secondary>Directions</Title>
          <List directions>
            {recipe.directions && recipe.directions.map((direction, i) => <li key={i}>{direction}</li>)}
          </List>
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
    recipe: state.recipe
  }
}

const mapDispatch = (dispatch) => {
  return {
    getRecipe: id => dispatch(action.getRecipe(id)),
    handleClick(evt) {
      console.log(action.getCooking)
      dispatch(action.getCooking(true))
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ViewRecipe))

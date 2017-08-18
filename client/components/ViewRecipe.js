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
    this.props.isCooking(false);
  }

  render() {
    const {recipe} = this.props;
    console.log(recipe);
    return (
      <Wrapper >
        <RecipeImg src={recipe.picture_url} />
        <RecipeText>

          <Title>{recipe && recipe.title}
            &nbsp;
             <Link to={`/recipe/${recipe.id}/cook`} className="btn btn-info btn-lg">
              <span className="glyphicon glyphicon-play" />
            </Link>

          </Title>
          <Title secondary>Ingredients</Title>
          <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}<Link to="#">
          <span className="glyphicon glyphicon-plus"></span></Link></li>)}
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
    isCooking: bool => dispatch(action.getCooking(bool))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ViewRecipe))

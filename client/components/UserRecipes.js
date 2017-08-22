import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Recipes, Tiles, ProfileWarning, TileLink } from './styled-components'
import Tile from './Tile'
import * as action from '../store'
/**
 * COMPONENT
 */
class UserRecipes extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchUserRecipes(this.props.user.id)
  }

  filterRecipes(recipes, input) {
    input = input.toLowerCase();
    return recipes.filter(recipe => {
      return recipe.title.toLowerCase().includes(input) ||
        recipe.directions.join().toLowerCase().includes(input) ||
        recipe.ingredients.join().toLowerCase().includes(input)
    })
  }

  render() {
    let { user, userRecipes, input } = this.props;
    userRecipes = this.filterRecipes(userRecipes, input)

    return (
      <Recipes>
        {
          userRecipes.length ?
            <Tiles>
              {userRecipes.map((recipe, i) => <TileLink key={i} to={`/recipe/${recipe.id}`}><Tile recipe={recipe} /></TileLink>)}
            </Tiles>
            :
            <ProfileWarning>You have no recipes! Go add some!</ProfileWarning>
        }
      </Recipes>
    )
  }

}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user,
    userRecipes: state.userRecipes,
    input: state.input
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchUserRecipes: (userId) => dispatch(action.fetchUserRecipes(userId))
  }
}

export default connect(mapState, mapDispatch)(UserRecipes)

/**
 * PROP TYPES
 */
UserRecipes.propTypes = {
  user: PropTypes.object
}

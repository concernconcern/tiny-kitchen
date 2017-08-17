import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, Tiles } from './styled-components'
import Tile from './Tile'
import * as action from '../store'


class AllRecipes extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getRecipes();
  }

  render() {
    const recipes = this.props.recipes;
    return (
      <Tiles>
        {recipes.length && recipes.map((recipe, i) => <Tile key={i} recipe={recipe}/>)}
      </Tiles>
    )
  }
}
/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    recipes: state.recipes.recipes
  }
}

const mapDispatch = (dispatch) => {
  return {
    getRecipes: id => dispatch(action.getRecipes())
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(AllRecipes))

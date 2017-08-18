import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link, Route, Switch } from 'react-router-dom'
import {connect} from 'react-redux'
import { Recipes, Tiles, ProfileWarning } from './styled-components'
import Tile from './Tile'
import * as action from '../store'
/**
 * COMPONENT
 */
class UserRecipes extends React.Component{
  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.props.fetchUserRecipes(this.props.user.id)
  }
  render(){
    const {user, userRecipes} = this.props;

    console.log(user)
    console.log(userRecipes)
    return (
      <Recipes>
        {
          userRecipes.length ?
          <Tiles>
           {userRecipes.map((recipe, i) => <Link key={i} to={`/recipe/${recipe.id}`}><Tile recipe={recipe}/></Link>)}
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
    userRecipes: state.userRecipes
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

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import * as action from '../store'
/**
 * COMPONENT
 */
class UserProfile extends React.Component{
  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.props.fetchUserRecipes(this.props.user.id)
    this.props.fetchGroceries(this.props.user.id)
  }
  render(){
    const {user, userRecipes, userGroceries} = this.props;
    return (
      <div>
        Welcome to the User Profile :)
        You have {userRecipes.length} recipes
      </div>
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
    userGroceries: state.groceries
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchUserRecipes: (userId) => dispatch(action.fetchUserRecipes(userId)),
    fetchGroceries: (userId) => dispatch(action.fetchGroceries(userId))
  }
}

export default connect(mapState, mapDispatch)(UserProfile)

/**
 * PROP TYPES
 */
UserProfile.propTypes = {
  user: PropTypes.object
}

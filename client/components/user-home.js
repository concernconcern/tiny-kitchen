import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Wrapper, Tiles, TileTitle, ProfileUpperArea, ProfileWarning } from './styled-components'
import Tile from './Tile'
import * as action from '../store'
/**
 * COMPONENT
 */
class UserHome extends React.Component{

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
      <div>
        <ProfileUpperArea row>
          <img className="media-object img-circle" src={user.picture_url} />
          {user.first_name + ' ' + user.last_name}

        </ProfileUpperArea>
        {
          userRecipes.length ?
          <Tiles>
           {userRecipes.map((recipe, i) => <Tile key={i} recipe={recipe}/>)}
          </Tiles>
          :
          <ProfileWarning>You have no recipes! Go add some!</ProfileWarning>
        }
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
    userRecipes: state.userRecipes
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchUserRecipes: (userId) => dispatch(action.fetchUserRecipes(userId))
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  user: PropTypes.object
}

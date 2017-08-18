import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import {connect} from 'react-redux'
import { Wrapper, Tiles, TileTitle, ProfileUpperArea, ProfileWarning, ProfileCard, ProfilePic, ProfilePicArea, ProfileInfoArea, Links } from './styled-components'
import Tile from './Tile'
import * as action from '../store'
/**
 * COMPONENT
 */
class UserNav extends React.Component{
  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.props.fetchUserRecipes(this.props.user.id)
  }
  render(){
    const {user, userRecipes} = this.props;
    return (
      <div>
        <ProfileUpperArea column>
          <ProfileCard>
            <ProfilePicArea>
              <ProfilePic src={user.picture_url} />
            </ProfilePicArea>
            <ProfileInfoArea>
              <h3>{user.first_name + ' ' + user.last_name}</h3>
              <h5>{user.email}</h5>
            </ProfileInfoArea>
          </ProfileCard>
            <Links>
              <Link to='/home/profile'>Profile</Link>
              <Link to='/home/recipes'>Recipes</Link>
            </Links>
        </ProfileUpperArea>
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

export default connect(mapState, mapDispatch)(UserNav)

/**
 * PROP TYPES
 */
UserNav.propTypes = {
  user: PropTypes.object
}

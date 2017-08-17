import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Wrapper, Tiles, TileTitle, ProfileUpperArea, ProfileWarning, ProfileCard, ProfileIcon } from './styled-components'
import Tile from './Tile'
import * as action from '../store'
/**
 * COMPONENT
 */
class UserHome extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchUserRecipes(this.props.user.id)
  }
  render() {
    const { user, userRecipes } = this.props;

    console.log(user)
    console.log(userRecipes)
    return (
      <div>
        <ProfileUpperArea row>
          <ProfileCard>
            <ProfileIcon>
              <img className="media-object img-circle" src={user.picture_url} />
            </ProfileIcon>
            {user.first_name + ' ' + user.last_name}
            {user.email}

          </ProfileCard>
        </ProfileUpperArea>
        {
          userRecipes.length ?
            <Tiles>
              {userRecipes.map((recipe, i) => <Link to={`/recipe/${recipe.id}`}><Tile key={i} recipe={recipe} /></Link>)}
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

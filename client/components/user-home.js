import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Wrapper, Tiles } from './styled-components'

/**
 * COMPONENT
 */
class UserHome extends React.Component{

  constructor(props){
    super(props)
  }


  render(){
    const {user, userRecipes} = this.props;
    console.log(user)
    return (
      <div>
        <div>
          {user.email}
        </div>
        {
          userRecipes.length ?
          <Tiles>
           {userRecipes.map((recipe, i) => <Tile key={i} recipe={recipe}/>)}
          </Tiles>
          :
          <h2>You have no recipes! Go add some!</h2>
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

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}

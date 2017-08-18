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
    super(props);
    this.state = {
      editing: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
    const {value} = event.target;
    const editing = value === 'edit' ? true : false;
    this.setState({editing});
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
              {this.state.editing ? 
                <div>
                  <form>
                    <input name="firstName"></input>
                    <input name="lastName"></input>
                    <input name="email"></input>
                  </form>
                  <button value="done" onClick={this.handleClick}>Done</button>
                </div>
                :
                <div>
                  <h3>{user.first_name + ' ' + user.last_name}</h3>
                  <h5>{user.email}</h5>
                  <button value="edit" onClick={this.handleClick}>Edit</button>
                </div>
              }
            </ProfileInfoArea>
          </ProfileCard>
            <Links>
              <Link to='/home/recipes'>Recipes</Link>
              <Link to='/home/groceries'>Groceries</Link>
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

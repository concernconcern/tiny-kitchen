import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import {connect} from 'react-redux'
import { ProfileUpperArea, ProfileCard, ProfilePic, ProfilePicArea, ProfileInfoArea, Links, AccentButton, ControlPanel, Heading, Title } from './styled-components'
import Tile from './Tile'
import ImgUpload from './ImgUpload';
import * as action from '../store'
/**
 * COMPONENT
 */
class UserNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editName: false,
      editEmail: false,
      name: '',
      email: '',
      editImg: false
    }

    this.handleNameClick = this.handleNameClick.bind(this);
    this.handleEmailClick = this.handleEmailClick.bind(this);
    this.handleDone = this.handleDone.bind(this);

  }

  handleNameClick(event) {
    const { value } = event.target;
    const editName = value === 'edit' ? true : false;
    this.setState({ editName });
  }

  handleEmailClick(event) {
    const { value } = event.target;
    const editEmail = value === 'edit' ? true : false;
    this.setState({ editEmail });
  }

  handleChange(event, type) {
    let newState = this.state;
    newState[type] = event.target.value
    this.setState(newState);
  }

  handleDone(event, type) {
    let newState = this.state;
    let field = type === 'name' ? 'editName' : 'editEmail';
    newState[field] = false;
    this.setState(newState);

    let info = this.state[type];
    this.props.updateUser(info, type);
  }

  componentDidMount() {
    this.props.fetchUserRecipes(this.props.user.id)
  }
  render() {
    const { user, userRecipes } = this.props;
    return (
      <div>
        <ProfileUpperArea column>

          <ProfileCard>
            <ProfilePicArea>


             <ProfilePic src={user.picture_url} />

            </ProfilePicArea>
            <ProfileInfoArea>
              <div>
                {this.state.editName ?
                  <ControlPanel profile>
                    <input onChange={(e) => this.handleChange(e, 'name')}></input>
                    <AccentButton small type="submit" onClick={(e) => this.handleDone(e, 'name')}>Done</AccentButton>
                  </ControlPanel>
                  :
                  <ControlPanel profile>
                    <Heading>{user.first_name + ' ' + user.last_name}</Heading>
                    <AccentButton small value="edit" onClick={this.handleNameClick}>Edit</AccentButton>
                  </ControlPanel>
                }
                {this.state.editEmail ?
                  <ControlPanel profile>
                    <input onChange={(e) => this.handleChange(e, 'email')}></input>
                    <AccentButton small type="submit" onClick={(e) => this.handleDone(e, 'email')}>Done</AccentButton>
                  </ControlPanel>
                  :
                  <ControlPanel profile>
                    <Heading secondary>{user.email}</Heading>
                    <AccentButton small value="edit" name="email" onClick={this.handleEmailClick}>Edit</AccentButton>
                  </ControlPanel>
                }
                <ImgUpload type='userImg' />
              </div>
            </ProfileInfoArea>
          </ProfileCard>
          <Links >
            <Title secondary ><Link style={{ color: "#5e5e5e" }} to='/home/recipes'>Recipes</Link></Title>
            <Title secondary><Link style={{ color: "#5e5e5e" }} to='/home/groceries'>Groceries</Link></Title>
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
    fetchUserRecipes: (userId) => dispatch(action.fetchUserRecipes(userId)),
    updateUser: (info, type) => dispatch(action.updateUser(info, type))
  }
}

export default connect(mapState, mapDispatch)(UserNav)

/**
 * PROP TYPES
 */
UserNav.propTypes = {
  user: PropTypes.object
}

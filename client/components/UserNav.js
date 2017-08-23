import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
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
      editing: false,
      name: '',
      email: ''
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      name: props.user.first_name + " " + props.user.last_name,
      email: props.user.email
    })
  }

  handleEdit = (event) => {
    const { value } = event.target;
    this.setState({ editing: true });
  }

  handleChange = (event, type) => {
    let newState = this.state;
    newState[type] = event.target.value
    this.setState(newState);
  }

  handleDone = (event) => {
    let name = this.state.name.split(" ");
    let first_name = name[0];
    let last_name = name[1];
    let email = this.state.email;
    let info = { first_name, last_name, email }
    this.props.updateUser(info);
    this.setState({ editing: false })
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
                {this.state.editing ?
                  <div>
                    <ControlPanel profile>
                      <input value={this.state.name} onChange={(e) => this.handleChange(e, 'name')}></input>
                    </ControlPanel>
                    <ControlPanel profile>
                      <input value={this.state.email} onChange={(e) => this.handleChange(e, 'email')}></input>
                    </ControlPanel>
                    <AccentButton small type="submit" onClick={this.handleDone}>Done</AccentButton>
                    <ImgUpload type='userImg' style={{ marginTop: "3px" }} />
                  </div>
                  :
                  <div>
                    <ControlPanel profile>
                      <Heading>{this.state.name}</Heading>
                    </ControlPanel>
                    <ControlPanel profile>
                      <Heading secondary>{this.state.email}</Heading>
                    </ControlPanel>
                    <AccentButton small value="edit" name="email" onClick={this.handleEdit}>Edit</AccentButton>
                  </div>
                }
              </div>
            </ProfileInfoArea>
          </ProfileCard>
          <Links style={{ width: "55vw" }}>
            <Title secondary><Link style={{ color: "#5e5e5e" }} to='/home/recipes'>Recipes</Link></Title>
            <Title secondary><Link style={{ color: "#5e5e5e" }} to='/home/groceries'>Groceries</Link></Title>
          </Links>
        </ProfileUpperArea>
      </div >
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
    updateUser: (info) => dispatch(action.updateUser(info))
  }
}

export default connect(mapState, mapDispatch)(UserNav)

/**
 * PROP TYPES
 */
UserNav.propTypes = {
  user: PropTypes.object
}

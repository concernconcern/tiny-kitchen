import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { auth, authChrome } from '../store'
import * as action from '../store'
import { NavLink, Input } from './styled-components'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  componentWillMount() {
    this.props.chromeUrl ? this.handleOpen() : ''
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  chrome = (evt) => {
    this.props.handleSubmit(evt, this.props.chromeUrl);
  }
  render() {
    const { name, displayName, error, handleSubmit } = this.props;
    let chromeUrl = this.props.chromeUrl ? this.props.chromeUrl : ''
    const submit = chromeUrl.length ? this.chrome : handleSubmit;

    const actions = [
      <FlatButton
        key="1"
        label="Cancel"
        primary={false}
        onClick={this.handleClose}
      />,
      <FlatButton
        key="2"
        label={displayName}
        primary={true}
        onClick={this.handleClose}
        type="submit"
        primary={true}
      />
    ];
    return (
      <div>
        <NavLink to="/" onClick={this.handleOpen}>{displayName}</NavLink>
        <Dialog
          contentStyle={{ width: "30%", display: "flex" }}
          title={displayName}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <form onSubmit={submit} name={name}>
            {
              displayName === 'Sign Up' ?
                <div>
                  <div>
                    <label htmlFor='name'><small>First Name</small></label>
                    <Input name='firstName' type='text' />
                  </div>
                  <div>
                    <label htmlFor='name'><small>Last Name</small></label>
                    <Input name='lastName' type='text' />
                  </div>
                </div>
                : null
            }
            <div>
              <label htmlFor='email'><small>Email</small></label>
              <Input name='email' type='text' />
            </div>
            <div>
              <label htmlFor='password'><small>Password</small></label>
              <Input name='password' type='password' />
            </div>

            <a href="/auth/google">
              <img src="/google.png"
                style={{ height: "50px", padding: "10px 0 0 0" }}
                key="1"
                label={`${displayName} w/ Google`}
              /></a>
            <div style={{ textAlign: 'right', padding: 8, margin: '24px -24px -24px -24px' }}>
              {actions}
            </div>
            {error && error.response && <div> {error.response.data} </div>}
          </form>

        </Dialog>
      </div>
    )
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit: (evt, chromeUrl) => {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      const first_name = evt.target.firstName ? evt.target.firstName.value : null;
      const last_name = evt.target.lastName ? evt.target.lastName.value : null;
      dispatch(auth(email, password, formName, first_name, last_name, chromeUrl))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { auth, authChrome } from '../store'
import * as action from '../store'
/**
 * COMPONENT
 */
class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.chrome = this.chrome.bind(this);
  }
  chrome(evt) {
    this.props.handleSubmit(evt, this.props.chromeUrl);
  }
  render() {
    const { name, displayName, error, handleSubmit } = this.props;
    let chromeUrl = this.props.chromeUrl ? this.props.chromeUrl : ''
    const submit = chromeUrl.length ? this.chrome : handleSubmit
    return (
      <div>
        <form onSubmit={submit} name={name}>
          {
            displayName === 'Sign Up' ?
              <div>
                <div>
                  <label htmlFor='name'><small>First Name</small></label>
                  <input name='firstName' type='text' />
                </div>
                <div>
                  <label htmlFor='name'><small>Last Name</small></label>
                  <input name='lastName' type='text' />
                </div>
              </div>
              : null
          }
          <div>
            <label htmlFor='email'><small>Email</small></label>
            <input name='email' type='text' />
          </div>
          <div>
            <label htmlFor='password'><small>Password</small></label>
            <input name='password' type='password' />
          </div>
          <div>
            <button type='submit'>{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
        <a href='/auth/google'>{displayName} with Google</a>
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
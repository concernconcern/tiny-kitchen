import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Router } from 'react-router'
import { Route, Switch, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
// import history from './history'
import history from './history'
import { Main, Login, Signup, UserHome, ViewRecipe, CookRecipe, AddRecipe, AllRecipes, Search } from './components'
import { me } from './store'

/**`
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const { isLoggedIn } = this.props

    return (
      <Router history={history}>
        <Main>
          <Switch>
            <Route exact path='/' component={AllRecipes} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/recipe/:recipeid/' component={ViewRecipe} />
            {
              isLoggedIn &&
              <Switch>
                <Route path='/recipe/:recipeid/user/:userid' component={ViewRecipe} />
                <Route exact path='/recipe/:recipeid/cook' component={CookRecipe} />
                <Route exact path='/home' component={UserHome} />
                <Route path='/add-recipe' component={AddRecipe} />
              </Switch>
            }

          </Switch>
        </Main>
      </Router>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

export default connect(mapState, mapDispatch)(Routes)

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}

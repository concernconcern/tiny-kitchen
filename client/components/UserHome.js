import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import UserNav from './UserNav'
import UserRecipes from './UserRecipes'
import UserGroceries from './UserGroceries'
import Tile from './Tile'
import * as action from '../store'

export default class UserHome extends React.Component {
  render() {
    return (
      <div>
        <UserNav/>
          <Switch>
            <Route exact path='/home/groceries' component={UserGroceries}/>
            <Route path='/home' component={UserRecipes}/>
          </Switch>
      </div>
    )
  }
}
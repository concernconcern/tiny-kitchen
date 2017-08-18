import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import * as action from '../store'
import { List } from './styled-components'
/**
 * COMPONENT
 */
class UserGroceries extends React.Component{
  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.props.fetchGroceries(this.props.user.id)
  }
  render(){
    const {user, userGroceries} = this.props;
    return (
      <List>
      {userGroceries && userGroceries.map((grocery, i) => <li key={i}>{grocery}</li>)}
      </List>
    )
  }

}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user,
    userGroceries: state.groceries
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchGroceries: (userId) => dispatch(action.fetchGroceries(userId))
  }
}

export default connect(mapState, mapDispatch)(UserGroceries)

/**
 * PROP TYPES
 */
UserGroceries.propTypes = {
  user: PropTypes.object
}

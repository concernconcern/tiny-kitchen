import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import * as action from '../store'
import { List } from './styled-components'
import axios from 'axios';
/**
 * COMPONENT
 */
class UserGroceries extends React.Component{
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    this.props.fetchGroceries(this.props.user.id)
  }

  handleClick(e){
    const {user, userGroceries} = this.props;
    axios.post(`/api/groceries/${user.id}/email`, {user, userGroceries})
    .then(res => {
      console.log(res.data);
    })
  }

  render(){
    const {user, userGroceries} = this.props;
    return (
      <div>
        <List>
        {userGroceries && userGroceries.map((grocery, i) => <li key={i}>{grocery}</li>)}
        </List>
        <button onClick={this.handleClick}>Email Me</button>
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
    userGroceries: state.groceries.map(grocery => grocery.title)
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

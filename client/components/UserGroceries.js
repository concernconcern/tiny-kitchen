import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import * as action from '../store'
import { List, AccentButton, Box, Modify } from './styled-components'
/**
 * COMPONENT
 */
class UserGroceries extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      edit: false
    }
    this.handleEdit = this.handleEdit.bind(this)
  }

  componentDidMount(){
    this.props.fetchGroceries(this.props.user.id)
  }

  handleEdit(){
    this.setState({edit: true})
  }

  render(){
    const {user, userGroceries} = this.props;
    return (
      this.state.edit ?
      <Box>
      {
        userGroceries && userGroceries.map((grocery, i) =>
         <div>
           <Modify x href="#" onClick={this.deleteField} name="groceries" id={i}>x</Modify>
           <input type="text" key={i.toString()} id={i} name="groceries" value={grocery} style={{ height: "auto", width: "auto" }} onChange={this.handleChange} />
         </div>)
      }
      <Modify href="#" onClick={this.addField} name="groceries">+</Modify>
      </Box>
      :
      <div>
        <AccentButton small value="edit" onClick={this.handleEdit}>Edit</AccentButton>
        <List key={i.toString()}>
        {userGroceries && userGroceries.map((grocery, i) => <li key={i}>{grocery}</li>)}
        </List>
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

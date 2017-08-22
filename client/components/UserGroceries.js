import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import * as action from '../store'
import { List, AccentButton, Box, Modify, Input, Form, Button } from './styled-components'
import IconButton from 'material-ui/IconButton';
/**
 * COMPONENT
 */
class UserGroceries extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      edit: false,
      totalFields: []
    }
    this.handleEdit = this.handleEdit.bind(this);
    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.helperChangeField = this.helperChangeField.bind(this);
  }

  componentDidMount(){
    this.props.fetchGroceries(this.props.user.id)
  }

  handleEdit(){
    this.setState({edit: true,
      totalFields: [...this.props.userGroceries]
    })
  }

  handleSubmit(e){
    e.preventDefault();
    let newGroceryList = [...this.state.totalFields];
    this.props.makeGroceryList(this.props.user.id, newGroceryList);
    this.setState({edit: false, totalFields: []})
  }

  //rendering another field to add grocery
  addField(e){
    e.preventDefault();
    this.setState({totalFields: this.state.totalFields.concat('')})
  }

  removeField(e) {
    e.preventDefault();
    this.setState({
      totalFields: this.state.totalFields.filter((grocery, i) =>
      Number(i) !== Number(e.target.id))
    })
  }

  handleChange(e){
    e.preventDefault();
    this.helperChangeField(e.target.id, e.target.value)
  }

  helperChangeField(fieldId, content){
    let newTotalFields = [...this.state.totalFields];
    newTotalFields[fieldId] = content;
    this.setState({totalFields: newTotalFields});
  }

  render(){
    const {user, userGroceries} = this.props;
    return (
      this.state.edit ?
      <Form onSubmit={this.handleSubmit}>
      <Box>
      {
        this.state.totalFields.map((grocery, i) =>
         <div>
           <Modify x href="#" onClick={this.removeField} name="groceries" id={i}>x</Modify>
           <Input type="text" key={i.toString()} id={i} name="groceries" value={grocery} style={{ height: "auto", width: "auto" }} onChange={this.handleChange} />
         </div>)
      }
      <IconButton
        style={{ width: "28px", height: "28px" }}
        iconStyle={{ fontSize: "20px", color: "#59a5f6" }}
        iconClassName="material-icons"
        tooltip="Add Grocery"
        tooltipPosition="bottom-right"
        onClick={this.addField}>
        add
      </IconButton>
      <Button type="submit">Done</Button>
      </Box>
      </Form>
      :
      <div>
        <AccentButton small value="edit" onClick={this.handleEdit}>Edit</AccentButton>
        <List>
        {userGroceries && userGroceries.map((grocery, i) => <li key={i.toString()}>{grocery}</li>)}
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
    fetchGroceries: (userId) => dispatch(action.fetchGroceries(userId)),
    makeGroceryList: (userId, newGroceryList) => {
      dispatch(action.submitGroceryList(userId, newGroceryList))
    }
  }
}

export default connect(mapState, mapDispatch)(UserGroceries)

/**
 * PROP TYPES
 */
UserGroceries.propTypes = {
  user: PropTypes.object
}

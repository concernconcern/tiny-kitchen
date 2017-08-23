import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import * as action from '../store'
import axios from 'axios';
import { List, AccentButton, Box, Modify, Input, Form, Button } from './styled-components'
import IconButton from 'material-ui/IconButton';
/**
 * COMPONENT
 */
class UserGroceries extends React.Component{
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      edit: false,
      displayedFields: [],
      editedIds: [],
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

  handleClick(e){
    const {user, userGroceries} = this.props;
    axios.post(`/api/groceries/${user.id}/email`, {user, userGroceries})
    .then(res => {
      console.log(res.data);
    })
  }

  handleEdit(){
    this.setState({edit: true,
      displayedFields: [...this.props.userGroceries]
    })
  }
//rendering another field to on the front end
  addField(e){
    e.preventDefault();
    this.setState({displayedFields: this.state.displayedFields.concat('')})
  }

  handleSubmit(e){
    e.preventDefault();
    let addedGroceryContents = this.state.displayedFields.filter((content, i) => i >= this.props.userGroceries.length)
    console.log('addedGroceryContents, ', addedGroceryContents)
    console.log('edited ids: ', this.state.editedIds)
    let editedGroceries = this.state.editedIds.length ? this.state.editedIds.map(fieldId => {
      return {
        editedId: this.props.userGroceries[fieldId].id,
        content: this.state.displayedFields[fieldId]
      }
    }) : [];

    console.log('editedGroceries: ', editedGroceries)
    this.props.makeGroceryList(this.props.user.id, editedGroceries, addedGroceryContents);
    this.setState({edit: false, editedIds: []})

  }



  removeField(e) {
    e.preventDefault();
    console.log('event id', e.target.id)
    let fieldId = Number(e.target.id)
    //if user removed an empty field
    if (fieldId > this.props.userGroceries.length - 1){
      this.setState({displayedFields: this.state.displayedFields.slice(this.state.displayedFields.length - 1)})
    }
    else {
      let inEditId = this.state.editedIds.indexOf(fieldId);
      if (inEditId !== -1)
        this.setState({editedIds: this.state.editedIds.slice(inEditId, inEditId+1)})
      let toRemoveId = this.props.userGroceries[fieldId].id
      this.props.deleteGrocery(toRemoveId)
      this.setState({
        displayedFields: this.state.displayedFields.filter((grocery, i) =>
        Number(i) !== fieldId)
      })
    }
  }

  handleChange(e){
    e.preventDefault();
    this.helperChangeField(e.target.id, e.target.value)
  }

  helperChangeField(fieldId, content){
    //records which fields were changed
    console.log('helperchangefield: ', fieldId + content)
    let numId = Number(fieldId)
    if (numId < this.props.userGroceries.length && this.state.editedIds.indexOf(numId) === -1){
      this.setState({
        editedIds: this.state.editedIds.concat(numId),
      })
    }
    console.log('edited ids: ', this.state.editedIds)
    let newDisplayedFields = [...this.state.displayedFields];
    newDisplayedFields[numId] = content;
    this.setState({
      displayedFields: newDisplayedFields,
    });
  }

  render(){
    const {user, userGroceries} = this.props;
    return (
      this.state.edit ?
      <Form onSubmit={this.handleSubmit}>
      <Box>
      {
        this.state.displayedFields.map((grocery, i) =>
         <div key={i}>
           <Modify x href="#" onClick={this.removeField} name="groceries" id={i}>x</Modify>
           <Input type="text" key={i.toString()} id={i} name="groceries" value={grocery.title} style={{ height: "auto", width: "auto" }} onChange={this.handleChange} />
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
        {userGroceries.length && userGroceries.map((grocery, i) => <li key={i.toString()}>{grocery.title}</li>)}
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
    userGroceries: state.groceries
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchGroceries: (userId) => dispatch(action.fetchGroceries(userId)),
    makeGroceryList: (userId, editedGroceries, addedGroceries) => {
      if (editedGroceries.length) dispatch(action.bulkUpdateGroceries(userId, editedGroceries))
      if (addedGroceries.length) dispatch(action.bulkAddGroceries(userId, addedGroceries))
    },
    deleteGrocery: (groceryId) => dispatch(action.reallyDeleteGrocery(groceryId))
  }
}

export default connect(mapState, mapDispatch)(UserGroceries)

/**
 * PROP TYPES
 */
UserGroceries.propTypes = {
  user: PropTypes.object
}

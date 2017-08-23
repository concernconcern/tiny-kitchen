import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as action from '../store'
import axios from 'axios';
import { List, AccentButton, Box, Modify, Title, Input, Form, Button, Wrapper, CenterWrap } from './styled-components'
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
/**
 * COMPONENT
 */
class UserGroceries extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      edit: false,
      displayedFields: [],
      editedIds: [],
      open: false,
      message: '',
    }
    this.handleEdit = this.handleEdit.bind(this);
    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.helperChangeField = this.helperChangeField.bind(this);
  }
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }
  componentDidMount() {
    this.props.fetchGroceries(this.props.user.id)
  }

  handleClick(e) {
    const { user, userGroceries } = this.props;
    axios.post(`/api/groceries/${user.id}/email`, { user, userGroceries })
      .then(res => {
        console.log(res.data);
      })
    this.setState({
      open: true,
      message: `Your grocery list was emailed to ${user.email}!`
    })
  }

  handleEdit() {
    this.setState({
      edit: true,
      displayedFields: [...this.props.userGroceries]
    })
  }
  //rendering another field to on the front end
  addField(e) {
    e.preventDefault();
    this.setState({ displayedFields: this.state.displayedFields.concat('') })
  }

  handleSubmit(e) {
    e.preventDefault();
    let addedGroceryContents = this.state.displayedFields.filter((content, i) => i >= this.props.userGroceries.length)
    let editedGroceries = this.state.editedIds.length ? this.state.editedIds.map(fieldId => {
      return {
        editedId: this.props.userGroceries[fieldId].id,
        content: this.state.displayedFields[fieldId]
      }
    }) : [];

    this.props.makeGroceryList(this.props.user.id, editedGroceries, addedGroceryContents);
    this.setState({ edit: false, editedIds: [] })

  }



  removeField(e) {
    e.preventDefault();
    let fieldId = Number(e.target.id)
    let firstPart = this.state.displayedFields.slice(0, fieldId);
    let secondPart = this.state.displayedFields.slice(fieldId+1, -1);
    let newDisplayedFields = firstPart.concat(secondPart);
    this.setState({displayedFields: newDisplayedFields});
    //if it's actually removing something
    if (fieldId <= this.props.userGroceries.length - 1){
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

  handleChange(e) {
    e.preventDefault();
    this.helperChangeField(e.target.id, e.target.value)
  }

  helperChangeField(fieldId, content) {
    //records which fields were changed
    let numId = Number(fieldId)
    if (numId < this.props.userGroceries.length && this.state.editedIds.indexOf(numId) === -1) {
      this.setState({
        editedIds: this.state.editedIds.concat(numId),
      })
    }
    let newDisplayedFields = [...this.state.displayedFields];
    newDisplayedFields[numId] = content;
    this.setState({
      displayedFields: newDisplayedFields,
    });
  }

  render() {
    const { user, userGroceries } = this.props;
    return (
      this.state.edit ?

        <Form onSubmit={this.handleSubmit} style={{ padding: "0" }}>
          {
            this.state.displayedFields.map((grocery, i) =>
              <div key={i}>
                <Modify x onClick={this.removeField} name="groceries" id={i}>x</Modify>

                <Input style={{ width: "20vw" }} type="text" key={i.toString()} id={i} name="groceries" value={grocery.title} onChange={this.handleChange} />
              </div>)
          }
          <div>
            <AccentButton small style={{ margin: "10px" }} onClick={this.addField}>Add</AccentButton>
            <AccentButton type="submit" small style={{ margin: "10px" }} >Done</AccentButton>
          </div>
        </Form>
        :
        <Wrapper column center>
          <div style={{ padding: "0 30px" }}>
            <List>
              {userGroceries.length && userGroceries.map((grocery, i) => <li key={i.toString()}>{grocery.title}</li>)}
            </List>
            <AccentButton small style={{ margin: "10px" }} value="edit" onClick={this.handleEdit}>Edit</AccentButton>
            <AccentButton small style={{ margin: "10px" }} onClick={this.handleClick}>Email Me</AccentButton>
          </div>
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
        </Wrapper>

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

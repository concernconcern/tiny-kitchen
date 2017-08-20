import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import { Notes, AccentButton, TextArea } from './styled-components'
import TextField from 'material-ui/TextField';
/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class NotesModal extends React.Component {
  state = {
    open: false,
    notes: ''
  };

  handleNoteChange = (e) => {
    this.setState({
      notes: e.target.value
    })
  }

  handleOpen = () => {
    this.setState({
      open: true,
      notes: this.props.notes
    });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({
      open: false
    })
    this.props.saveNote(this.props.user, this.props.recipe, { notes: this.state.notes })
  }

  render() {

    const actions = [
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.handleSubmit}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <a href="#" onClick={this.handleOpen}>
          <IconButton
            iconStyle={{ fontSize: "25px", padding: "0", color: "#59a5f6" }}
            iconClassName="material-icons"
            tooltip="Edit Notes"
            onClick={this.handleOpen}
            tooltipPosition="bottom-right">
            note_add
  </IconButton>
        </a>
        <Dialog
          title="My notes"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField multiLine={true}
            rows={4}
            id="edit"
            fullWidth={true}
            defaultValue={this.state.notes}
            onChange={this.handleNoteChange} />

        </Dialog>
      </div >
    );
  }
}


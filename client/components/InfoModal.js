import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class InfoModal extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton
        label="Got it"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <span style={{ fontSize: "35px", position: "absolute", color: "#a5a5a5", top: "14px", right: "75px", cursor: "pointer" }} className="glyphicon glyphicon-question-sign" onClick={this.handleOpen} />
        <Dialog
          title="How to Use Cooking Mode"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Mochi the mouse is your personal cooking assistant<br /><br />
          To control Mochi's reading, you can say: <em>'start cooking'</em>, <em>'start'</em>, <em>'stop'</em>, or <em>'pause'</em><br />
          You can ask him unit conversion questions: e.g. <em>'what is one tablespoon to teaspoons'</em>, or <em>'convert one tablespoon to teaspoons'</em><br />
          You can also set a timer: e.g. <em>'set a timer for 5 minutes'</em>
        </Dialog>
      </div>
    );
  }
}
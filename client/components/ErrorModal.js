import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class ErrorModal extends React.Component {
  constructor(){
    super();
    this.state = {
      open: true
    }
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(){
    this.setState({open: false})
  }
  render(){
    const actions = [
      <FlatButton
        label="Got it"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    
    return (
        <Dialog
        title="We're sorry"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}>
         <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ padding: "0 60px" }}>We weren't able to read a recipe on that page. Please use the form below to enter the recipe information.
            </div>
          </div>
        </Dialog>
    )
  }
}
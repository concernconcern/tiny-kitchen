import React from 'react';
import { connect } from 'react-redux';
import { ImageUploadCard } from './styled-components';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { NavLink, Input, ControlPanel } from './styled-components';
import * as action from '../store';

var divStyle = {
  width: '250px',
  height: '250px',
  border: '1px solid grey',
  textAlign: 'center'
};

class ImgUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
      error: '',
      successMsg: '',
      open: false,
      imgUrl: ''
    };

    this.handleImageChange = this.handleImageChange.bind(this); //shows img preview
    this.handleUpload = this.handleUpload.bind(this); //triggers get signed request if a file is chosen
    this.getSignedRequest = this.getSignedRequest.bind(this); //gets amazon url
    this.uploadFile = this.uploadFile.bind(this); //actually uploads to amazon
    this.handleClose = this.handleClose.bind(this); //closes modal
    this.handleOpen = this.handleOpen.bind(this); //opens modal
    this.handleSubmit = this.handleSubmit.bind(this); //submits the url to db
  }

  handleClose () {
    this.setState({
      file: '',
      imagePreviewUrl: '',
      error: '',
      successMsg: '',
      open: false,
      imgUrl: '' });
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleSubmit() {
    if (this.state.imgUrl === '') {
      this.setState({error: 'Please upload image or add image url'});
    } else {
      if (this.props.type === 'userImg'){
        this.props.updateUser(this.state.imgUrl, 'picture_url');
      } else if (this.props.type === 'addRecipe') {
        let recipe = {};
        recipe.picture_url = [this.state.imgUrl];
        this.props.getRecipeSuccess(recipe);
      }
      this.handleClose();
    }
  }

  uploadFile(file, signedRequest, url){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4){
        if (xhr.status === 200){
          this.setState({successMsg: 'Image uploaded :)'});
          this.setState({imgUrl: url});
        }
        else {
          this.setState({error: 'Image upload failed'})
        }
      }
    };
    xhr.send(file);
  }


  getSignedRequest(file){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4){
        if (xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(file, response.signedRequest, response.url);
        }
        else {
          this.setState({error: 'Image upload failed (could not get signed url)'});
        }
      }
    };
    xhr.send();
  }


  handleUpload(event) {
    event.preventDefault();
    this.setState({error: ''});
    if (this.state.file !== '') { this.getSignedRequest(this.state.file); }
    else {
      this.setState({error: 'Please select an image to upload first'});
    }
  }

  handleImageChange(event) {
    event.preventDefault();

    this.setState({error: ''});

    if (event.target.name === 'textbox') {
      this.setState({imagePreviewUrl: event.target.value, imgUrl: event.target.value});
    } else {

      let reader = new FileReader();
      let file = event.target.files[0];

      if (file === null){
        this.setState({error:'No file selected.'});
      }

      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }

      reader.readAsDataURL(file);
    }
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (<img style={divStyle} src={imagePreviewUrl} />);
    } else {
      imagePreview = (<div className="previewText">Please select an image for preview</div>);
    }

    const actions = [
      <FlatButton
        key="1"
        label="Cancel"
        primary={false}
        onClick={this.handleClose}
      />,
      <FlatButton
        key="2"
        label="Submit"
        primary={true}
        onClick={this.handleSubmit}
      />
    ];

    return (
    <div>
        <i onClick={this.handleOpen} className="material-icons" style={{ fontSize: "30px", color: "#a5a5a5", cursor: "pointer" }}>insert_photo</i>
      <Dialog
        contentStyle={{ width: "30%", display: "flex" }}
        title='Image Upload'
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
      <center>
      <ImageUploadCard>

        <form> Image Url:<input type="text" name='textbox' onChange={this.handleImageChange} /></form>

        <form>
        Image Upload:<input
            name='imgfile'
            type="file"
            onChange={this.handleImageChange} />
          <br />
        <div className="imgPreview" style={divStyle}>
          {imagePreview}
        </div>
          <FlatButton label="Upload Image" onClick={this.handleUpload}><i className="material-icons"  style={{ color: "black", cursor: "pointer"}}>file_upload</i></FlatButton>

            {this.state.error !== '' ? <p style={{ color: "red" }}>{this.state.error}</p> : null}
            {this.state.successMsg !== '' ? <p style={{ color: "green" }}>{this.state.successMsg}</p> : null}
        </form>
      </ImageUploadCard>
      </center>
      </Dialog>
    </div>
    )
  }
}


const mapState = null;
const mapDispatch = (dispatch) => {
  return {
    updateUser: (info, type) => dispatch(action.updateUser(info, type)),
    getRecipeSuccess: (recipe) => dispatch(action.getRecipeSuccess(recipe))

  }
};

export default connect(mapState, mapDispatch)(ImgUpload);

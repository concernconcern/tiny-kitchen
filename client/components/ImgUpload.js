import React from 'react';
import { connect } from 'react-redux';
import { ImageUploadCard } from './styled-components';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { NavLink, Input, ControlPanel, AccentButton } from './styled-components';
import * as action from '../store';

var divStyle = {
  width: '200px',
  height: '200px',
  border: '1px solid #db7d7d',
  alignContent: "center",
  justifyContent: "center",
  alignItems: "center",
  margin: "10px 5px",
  display: 'flex',
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

  }
  //closes modal
  handleClose = () => {
    this.setState({
      file: '',
      imagePreviewUrl: '',
      error: '',
      successMsg: '',
      open: false,
      imgUrl: ''
    });
  }

  //opens modal
  handleOpen = () => {
    this.setState({ open: true });
  }

  //submits the url to db
  handleSubmit = () => {
    if (this.state.imgUrl === '') {
      this.setState({ error: 'Please upload image or add image url' });
    } else {
      if (this.props.type === 'userImg') {

        let picture = { picture_url: this.state.imgUrl }
        this.props.updateUser(picture);
      } else if (this.props.type === 'addRecipe') {
        let recipe = {};
        recipe.picture_url = [this.state.imgUrl];
        recipe.selected_pic = this.state.imgUrl;
        this.props.getRecipeSuccess(recipe);
      }
      this.handleClose();
    }
  }

  //actually uploads to amazon
  uploadFile = (file, signedRequest, url) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.setState({ successMsg: 'Image uploaded :)' });
          this.setState({ imgUrl: url });
        }
        else {
          this.setState({ error: 'Image upload failed' })
        }
      }
    };
    xhr.send(file);
  }

  //gets amazon url
  getSignedRequest = (file) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(file, response.signedRequest, response.url);
        }
        else {
          this.setState({ error: 'Image upload failed (could not get signed url)' });
        }
      }
    };
    xhr.send();
  }

  //triggers get signed request if a file is chosen
  handleUpload = (event) => {
    event.preventDefault();
    this.setState({ error: '' });
    if (this.state.file !== '') { this.getSignedRequest(this.state.file); }
    else {
      this.setState({ error: 'Please select an image to upload first' });
    }
  }

  //shows img preview
  handleImageChange = (event) => {
    event.preventDefault();

    this.setState({ error: '' });

    if (event.target.name === 'textbox') {
      this.setState({ imagePreviewUrl: event.target.value, imgUrl: event.target.value });
    } else {

      let reader = new FileReader();
      let file = event.target.files[0];

      if (file === null) {
        this.setState({ error: 'No file selected.' });
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
    let { imagePreviewUrl } = this.state;
    let imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (<img style={divStyle} src={imagePreviewUrl} />);
    } else {
      imagePreview = "Please select an image for preview"
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
      <div style={{ display: "inline", margin: "0 3px" }}>
        <AccentButton small onClick={this.handleOpen} style={{
          margin: "10px"
        }}>Upload Image</AccentButton>
        < Dialog
          contentStyle={{ width: "30%", display: "flex" }}
          title='Image Upload'
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <ImageUploadCard >
            Image Url:<Input type="text" name='textbox' onChange={this.handleImageChange} />
            Image Upload:<Input
              name='imgfile'
              type="file"
              onChange={this.handleImageChange} />
            <div className="imgPreview" style={divStyle}>
              {imagePreview}
            </div>
            <FlatButton label="Upload Image" onClick={this.handleUpload}><i className="material-icons" style={{ color: "black", cursor: "pointer" }}>file_upload</i></FlatButton>

            {this.state.error !== '' ? <p style={{ color: "red" }}>{this.state.error}</p> : null}
            {this.state.successMsg !== '' ? <p style={{ color: "green" }}>{this.state.successMsg}</p> : null}

          </ImageUploadCard>

        </Dialog>
      </div >
    )
  }
}


const mapState = (state) => {
  return {
    recipe: state.recipe,
    user: state.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateUser: (info) => dispatch(action.updateUser(info)),
    getRecipeSuccess: (recipe) => dispatch(action.getRecipeSuccess(recipe))

  }
};

export default connect(mapState, mapDispatch)(ImgUpload);

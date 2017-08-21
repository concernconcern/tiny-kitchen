import React from 'react';
import { connect } from 'react-redux';
import { ImageUploadCard } from './styled-components';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { NavLink, Input } from './styled-components'

var divStyle = {
  width: '300px',
  height: '300px',
  border: '1px solid grey'
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

    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSignedRequest = this.getSignedRequest.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentWillMount(){
    this.handleOpen();
  }

    handleClose () {
    this.setState({ open: false });
  }

  handleOpen() {
    this.setState({ open: true });
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
          this.setState({error: 'Image upload failed :('})
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
          this.setState({error: 'Image upload failed :( (could not get signed url)'});
        }
      }
    };
    xhr.send();
  }


  handleSubmit(e) {
    e.preventDefault();
    if (this.state.file !== '') { this.getSignedRequest(this.state.file); }
    else {
      this.setState({error: 'Please select and image to upload first!'});
    }
  }

  handleImageChange(e) {
    this.setState({error: ''});
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

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

  render() {
    let {imagePreviewUrl} = this.state;
    let imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (<img style={divStyle} src={imagePreviewUrl} />);
    } else {
      imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    const actions = [
      <FlatButton
        key="1"
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
    ];

    return (
    <div>
      <NavLink href="#" onClick={this.handleOpen}>Image Uplaod</NavLink>
      <Dialog
        contentStyle={{ width: "30%", display: "flex" }}
        title='Image Upload'
        modal={true}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
      <ImageUploadCard>
        <form onSubmit={this.handleSubmit}>
          <input
            type="file"
            onChange={this.handleImageChange} />
          <button className="submitButton"
            type="submit"
            onClick={this.handleSubmit}>Upload Image</button>
            {this.state.error !== '' ? <p>{this.state.error}</p> : null}
            {this.state.successMsg !== '' ? <p>{this.state.successMsg}</p> : null}
        </form>
        <br />
        <div className="imgPreview" style={divStyle}>
          {imagePreview}
        </div>
        <div style={{ textAlign: 'right', padding: 8, margin: '24px -24px -24px -24px' }}>
              {actions}
        </div>
      </ImageUploadCard>
      </Dialog>
    </div>
    )
  }
}


const mapState = null;
const mapDispatch = null;

export default connect(mapState, mapDispatch)(ImgUpload);

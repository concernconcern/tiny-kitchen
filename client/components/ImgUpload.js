import React from 'react';
import { connect } from 'react-redux';

// class ImgUpload extends React.Component {
//   constructor(props){
//     super(props);
//     this.initUpload = this.initUpload.bind(this);
//   }

//   initUpload(evt){
//     console.log(evt);
//     // const files = document.getElementById('file-input').files;
//     // const file = files[0];
//     //   if(file == null){
//     //     return alert('No file selected.');
//     //   }
//     //   getSignedRequest(file);
//   }

//   render() {
//     return (
//       <div>
//         <h1>Edit your account</h1>

//         <hr />

//         <h2>Your avatar</h2>


//         <input type="file" id="file-input" onChange={this.initUpload}/>
//         <p id="status">Please select a file</p>
//         <img style={divStyle}  id="preview" src="/images/default.png" />

//         <h2>Your information</h2>

//         <form method="POST" action="/save-details">
//           <input type="hidden" id="avatar-url" name="avatar-url" value="/images/default.png" />
//           <input type="text" name="username" placeholder="Username" /><br />
//           <input type="text" name="full-name" placeholder="Full name" /><br /><br />

//           <hr />
//           <h2>Save changes</h2>

//           <input type="submit" value="Update profile" />
//         </form>
//     </div>
//     )
//   }
// }

var divStyle = {
  width: '300px',
  border: '1px solid gray'
};

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};

    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render() {
    console.log('STATE:', this.state);
    let {imagePreviewUrl} = this.state;
    let imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="previewComponent">
        <form onSubmit={this.handleSubmit}>
          <input className="fileInput"
            type="file"
            onChange={this.handleImageChange} />
          <button className="submitButton"
            type="submit"
            onClick={(e)=>this.handleSubmit(e)}>Upload Image</button>
        </form>
        <div className="imgPreview">
          {imagePreview}
        </div>
      </div>
    )
  }
}

    /*
      Function to carry out the actual PUT request to S3 using the signed request from the app.
    */
    // function uploadFile(file, signedRequest, url){
    //   const xhr = new XMLHttpRequest();
    //   xhr.open('PUT', signedRequest);
    //   xhr.onreadystatechange = () => {
    //     if(xhr.readyState === 4){
    //       if(xhr.status === 200){
    //         document.getElementById('preview').src = url;
    //         document.getElementById('avatar-url').value = url;
    //       }
    //       else{
    //         alert('Could not upload file.');
    //       }
    //     }
    //   };
    //   xhr.send(file);
    // }

    // /*
    //   Function to get the temporary signed request from the app.
    //   If request successful, continue to upload the file using this signed
    //   request.
    // */
    // function getSignedRequest(file){
    //   const xhr = new XMLHttpRequest();
    //   xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    //   xhr.onreadystatechange = () => {
    //     if(xhr.readyState === 4){
    //       if(xhr.status === 200){
    //         const response = JSON.parse(xhr.responseText);
    //         uploadFile(file, response.signedRequest, response.url);
    //       }
    //       else{
    //         alert('Could not get signed URL.');
    //       }
    //     }
    //   };
    //   xhr.send();
    // }


    //  Function called when file input updated. If there is a file selected, then
    //  start upload procedure by asking for a signed request from the app.

    // function initUpload(){
    //   const files = document.getElementById('file-input').files;
    //   const file = files[0];
    //   if(file == null){
    //     return alert('No file selected.');
    //   }
    //   getSignedRequest(file);
    // }

    // /*
    //  Bind listeners when the page loads.
    // */
    // (() => {
    //     document.getElementById('file-input').onchange = initUpload;
    // })();

const mapState = null;
const mapDispatch = null;

export default connect(mapState, mapDispatch)(ImageUpload);
// export default connect(mapState, mapDispatch)(ImgUpload);

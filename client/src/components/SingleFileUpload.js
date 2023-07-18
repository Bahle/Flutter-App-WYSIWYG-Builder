import React from 'react'
import { Upload, Icon, message } from 'antd';
import './SingleFileUpload.css'

let location = window.location.pathname.split('/');
location = location[location.length-1] || location[location.length-2];

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  /*const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }*/
  const isJSON = file.type == 'application/json';
  if (!isJSON) {
    message.error('You can only upload JSON file!');
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJSON && isLt2M;
}

class Avatar extends React.Component {
  state = {
    loading: false,
    imageUrl: this.props.value
  };

  handleChange = info => {
    // alert(JSON.stringify(info))
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, imageUrl => {
        this.setState({
          imageUrl: 'iconUrl', // <- TO-DO place icon here later
          loading: false,
        })

        this.props.onChange('/' + location + '/' + info.file.name)
      // });
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action='/files' //"https://www.mocky.io/v2/5cc8019d300000980a055e76" <- !!! this needs to be a prop
        headers={{project: location}}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <div><img src={imageUrl} alt="JSON File" style={{ width: '100%' }} /></div> : uploadButton}
      </Upload>
    );
  }
}

export default Avatar
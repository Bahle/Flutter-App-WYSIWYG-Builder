import React from 'react'
import RUG from 'react-upload-gallery'
import { Modal, Button } from 'antd';
import axios from 'axios'
import 'react-upload-gallery/dist/style.css'

let location = window.location.pathname.split('/');
location = location[location.length-1] || location[location.length-2];;
// alert(location);

const RUGElement = props => {
	const [images, setImages] = React.useState([])

	React.useEffect(() => {
		// let images = [];
		axios
			.get('http://localhost:5000/images?project=' + location)
			.then(response => {
				console.log(JSON.stringify(response.data.result))
				// images = response.result
				setImages(response.data.result)
			})
	}, [])

	return (
		images.length == 0 ? <div>loading...</div> : <RUG
		  action="http://localhost:5000/images" // upload route
		  headers={{project: location}}
		  source={response => response.source } // response image source
		  initialState={images} // {source: './logo512.png', name: 'logo'}
		  onClick={props.handleSelectImage}
		/>
	)
}

class ImageDialog extends React.Component {
  state = { visible: false };
  childElement = React.Children.only(this.props.children);

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleSelectImage(e) {
	// alert('clicked: ' + JSON.stringify(e))
	this.setState({visible: false})
	// console.dir(this.props.children)
	// this.formRef.hello()
	this.formRef.props.getImage(e.source) // it works!
  }

  render() {
    return (
      <div>
        {/*<Button type="primary" onClick={this.showModal}>
          Open Modal
        </Button>*/}
        <div onClick={this.showModal}>
        	{
	            React.cloneElement(
	              this.childElement, 
	              { ref: el => this.formRef = el }
	            )
	          }
        </div>

        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="750px"
        >
          <RUGElement handleSelectImage={this.handleSelectImage.bind(this)} />
        </Modal>
      </div>
    );
  }
}

export default ImageDialog;
import React, { Component } from 'react';
import { Form, Input } from 'antd';
import ImageDialog from './ImageDialog'

class Image extends React.Component {
	constructor(props) {
		super(props);
	}

	formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    refreshProps() {
    	this.props.form.setFieldsValue({
	      text: JSON.parse(window.localStorage.currentSelection).widgetProps.text,
	    });
    }

    componentDidMount() {
    	this.fuck.input.setAttribute('readonly', 'readonly')
    }

    getImage(value) {
    	// alert('getImage: ' + value)
    	// console.dir(this.fuck)
    	this.fuck.input.value = value;

    	this.props.setImage(value)
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<ImageDialog>
				<Form getImage={this.getImage.bind(this)} {...this.formItemLayout}>
			        <Form.Item label="Image" style={{cursor: 'pointer'}}>
			          {getFieldDecorator('text', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.text, 
			            rules: [
			              /*{
			                type: 'email',
			                message: 'The input is not valid E-mail!',
			              },*/
			              {
			                required: true,
			                message: 'Please input the text',
			              },
			            ],
			          })(<Input addonBefore="Choose file" placeholder='Click to select file' ref={fuck => this.fuck = fuck} />)}
			        </Form.Item>
			    </Form>
			</ImageDialog>
		)
	}
}

const ImageSidebar = Form.create({ name: 'register' })(Image);

class ImageActions {
	static setImage(value, stageRef) {
		alert('Change image: ' + value)
		// console.dir(stageRef)
	}
}

export {
	ImageSidebar, ImageActions 
};


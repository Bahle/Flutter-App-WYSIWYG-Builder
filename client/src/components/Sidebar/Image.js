import React, { Component } from 'react';
import { Form, Input } from 'antd';

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

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="Text">
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
		          })(<Input addonBefore="Choose file" readonly placeholder='Click to select file' ref={fuck => this.fuck = fuck} onClick={this.props.setImage} />)}
		        </Form.Item>
		    </Form>
		)
	}
}

const ImageSidebar = Form.create({ name: 'register' })(Image);

class ImageActions {
	static setImage(e, stageRef) {
		alert('Change image')
		// const selected = JSON.parse(window.localStorage.currentSelection).id;
		// stageRef.setText(e.target.value);
	}
}

export {
	ImageSidebar, ImageActions 
};


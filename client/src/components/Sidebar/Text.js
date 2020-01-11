import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { initializeAction } from '../../utils.js'

class Text extends React.Component {
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
		          })(<Input onChange={this.props.setText} />)}
		        </Form.Item>
		    </Form>
		)
	}
}

const TextSidebar = Form.create({ name: 'register' })(Text);

class TextActions {
	static initialize() {
		this.actions = initializeAction(['setText'], this);
	}
}

export {
	TextSidebar, TextActions 
};


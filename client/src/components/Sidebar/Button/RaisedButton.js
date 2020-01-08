import React, { Component } from 'react';
import { Form, Input } from 'antd';

class RaisedButton extends React.Component {
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
		                message: 'Please input the button text',
		              },
		            ],
		          })(<Input ref={fuck => this.fuck = fuck} onChange={this.props.setText} />)}
		        </Form.Item>
		    </Form>
		)
	}
}

const RaisedButtonSidebar = Form.create({ name: 'register' })(RaisedButton);

class RaisedButtonActions {
	static setText(e, stageRef) {
		const selected = JSON.parse(window.localStorage.currentSelection).id;
		stageRef.setText(e.target.value);
	}
}

export {
	RaisedButtonSidebar, RaisedButtonActions 
};


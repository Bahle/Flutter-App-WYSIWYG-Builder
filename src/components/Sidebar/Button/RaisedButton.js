import React, { Component } from 'react';
import { Form, Input } from 'antd';

class RaisedButton extends React.Component {
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

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout} onSubmit={() => {}}>
		        <Form.Item label="Text">
		          {getFieldDecorator('text', {
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
		          })(<Input />)}
		        </Form.Item>
		    </Form>
		)
	}
}

const RaisedButtonForm = Form.create({ name: 'register' })(RaisedButton);
export default RaisedButtonForm;
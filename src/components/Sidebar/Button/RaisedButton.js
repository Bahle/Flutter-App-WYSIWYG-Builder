import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { observer, inject } from 'mobx-react'

@inject('toolDomainStore')
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

    handleChange(e) {
    	// console.dir(e.target.value);
    	this.props.toolDomainStore.setText(e.target.value)
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
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
		          })(<Input onChange={this.handleChange.bind(this)} />)}
		        </Form.Item>
		    </Form>
		)
	}
}

const RaisedButtonForm = Form.create({ name: 'register' })(RaisedButton);
export default RaisedButtonForm;
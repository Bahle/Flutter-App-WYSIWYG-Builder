import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { initializeAction } from '../../../utils.js'
import { EventEmitter } from '../../../utils/Events.js'
import Common from '../Common'

class OutlineButton extends Common {
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
			<React.Fragment>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Text">
			          {getFieldDecorator('text', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.text, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the button text',
			              },
			            ],
			          })(<Input onChange={ event => EventEmitter.dispatch('setText', event.target.value) } />)}
			        </Form.Item>
			    </Form>

			    { super.render() }
			</React.Fragment>
		)
	}
}

const OutlineButtonSidebar = Form.create({ name: 'register' })(OutlineButton);

export default OutlineButtonSidebar;


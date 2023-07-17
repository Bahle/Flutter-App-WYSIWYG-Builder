import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
// import { initializeAction } from '../../../utils.js'
import { EventEmitter } from '../../../utils/Events.js'
import Common from '../Common'

const { TextArea } = Input;

class DropdownButton extends Common {
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
	      options: JSON.parse(window.localStorage.currentSelection).widgetProps.options,
	    });
    }

    render() {
    	const { getFieldDecorator } = this.props.form;

		return(
			<React.Fragment>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Options">
			          {getFieldDecorator('options', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.options, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the options',
			              },
			            ],
			          })(<TextArea row={5} style={{height: '150px'}} onChange={ event => EventEmitter.dispatch('setOptions', event.target.value) } />)}
			        </Form.Item>		        
			    </Form>

			    { super.render() }
			</React.Fragment>
		)
	}
}

const DropdownButtonSidebar = Form.create({ name: 'register' })(DropdownButton);

export default DropdownButtonSidebar;


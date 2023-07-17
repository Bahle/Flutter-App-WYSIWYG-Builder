import React, { Component } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { initializeAction } from '../../../utils.js'
import { EventEmitter } from '../../../utils/Events.js'
import IconsDialog from '../../IconsDialog'
import Common from '../Common'

class IconButton extends Common {
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
	      icon: JSON.parse(window.localStorage.currentSelection).widgetProps.icon,
	    });
    }

    getIcon(value) {
    	this.icon.input.value = value;
    	
    	EventEmitter.dispatch('setIcon', value)
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<React.Fragment>
				<Form {...this.formItemLayout}>
			        {/*<Form.Item label="Icon">
			          {getFieldDecorator('icon', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.icon, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the button icon',
			              },
			            ],
			          })(<Input onChange={ event => EventEmitter.dispatch('setIcon', event.target.value) } />)}
			        </Form.Item>*/}

			        <IconsDialog>
				        <Form.Item geticon={this.getIcon.bind(this)} label="Icon" style={{cursor: 'pointer'}}>
				          {getFieldDecorator('icon', {
				          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.icon, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the icon',
				              },
				            ],
				          })(<Input addonBefore="Choose icon" placeholder='Click to select icon' ref={input => this.icon = input} />)}
				        </Form.Item>
			        </IconsDialog>
			    </Form>

			    <Form.Item label="Font Size">
		          {getFieldDecorator('fontSize', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.fontSize, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the button font size',
		              },
		            ],
		          })(<InputNumber onChange={ value => EventEmitter.dispatch('setFontSize', value) } />)}
		        </Form.Item>

			    { super.render() }
			</React.Fragment>
		)
	}
}

const IconButtonSidebar = Form.create({ name: 'register' })(IconButton);

export default IconButtonSidebar;


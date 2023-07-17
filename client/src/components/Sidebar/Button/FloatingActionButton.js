import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import { initializeAction } from '../../../utils.js'
import { EventEmitter } from '../../../utils/Events.js'
import IconsDialog from '../../IconsDialog'
import Common from '../Common'

const { Option } = Select;

class FloatingActionButton extends Common {
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
	      icon: JSON.parse(window.localStorage.currentSelection).widgetProps.icon,
	      size: JSON.parse(window.localStorage.currentSelection).widgetProps.size,
	      docked: JSON.parse(window.localStorage.currentSelection).widgetProps.docked,
	      mini: JSON.parse(window.localStorage.currentSelection).widgetProps.mini,
	    });
    }

    getIcon(value) {
    	this.icon.input.value = value;
    	
    	EventEmitter.dispatch('setIcon', value)
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<div>
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

			        <Form.Item label="Docked">
			          {getFieldDecorator('docked', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.docked
			          })(<Select onChange={ value => EventEmitter.dispatch('setDocked', value) }>
			          		<Option value="">None</Option>
			          		<Option value="BottomRight">Bottom Right</Option>
			          		<Option value="BottomCenter">Bottom Center</Option>
			          </Select>)}
			        </Form.Item>

			        <Form.Item label="Mini">
			          {getFieldDecorator('mini', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.mini || "default"
			          })(<Select onChange={ value => EventEmitter.dispatch('setMini', value) }>
			          		<Option value="default">Default</Option>
			          		<Option value="mini">Mini</Option>
			          </Select>)}
			        </Form.Item>
			    </Form>

			    { super.render() }
			</div>
		)
	}
}

const FloatingActionButtonSidebar = Form.create({ name: 'register' })(FloatingActionButton);

export default FloatingActionButtonSidebar;


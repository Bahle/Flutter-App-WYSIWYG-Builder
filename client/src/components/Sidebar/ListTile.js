import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { initializeAction } from '../../utils.js'
import IconsDialog from '../IconsDialog'
import { EventEmitter } from '../../utils/Events.js'
import Common from './Common'

class ListTile extends Common {
	constructor(props) {
		super(props);

		this.widgetProps = JSON.parse(window.localStorage.currentSelection).widgetProps
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
	      text: this.widgetProps.text,
	    });
    }

    getLeadingIcon(value) {
    	this.leadingIcon.input.value = value;
    	// this.props.setLeadingIcon(value)
    	EventEmitter.dispatch('setLeadingIcon', value)
    }

    getTrailingIcon(value) {
    	this.trailingIcon.input.value = value;
    	// this.props.setTrailingIcon(value)
    	EventEmitter.dispatch('setTrailingIcon', value)
    }
    
    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<div>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Title">
			          {getFieldDecorator('title', {
			          	initialValue: this.widgetProps.title, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the title',
			              },
			            ],
			          })(<Input onChange={ event => EventEmitter.dispatch('setTitle', event.target.value) } />)} {/*this.props.setTitle.bind(this)*/}
			        </Form.Item>

			        <Form.Item label="Subtitle">
			          {getFieldDecorator('subtitle', {
			          	initialValue: this.widgetProps.subtitle, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the subtitle',
			              },
			            ],
			          })(<Input onChange={ event => EventEmitter.dispatch('setSubtitle', event.target.value) } />)}
			        </Form.Item>

			        <IconsDialog>
				        <Form.Item geticon={this.getLeadingIcon.bind(this)} label="Leading Icon" style={{cursor: 'pointer'}}>
				          {getFieldDecorator('Leading Icon', {
				          	initialValue: this.widgetProps.leadingIcon, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the icon',
				              },
				            ],
				          })(<Input addonBefore="Choose icon" placeholder='Click to select file' ref={input => this.leadingIcon = input} />)}
				        </Form.Item>
			        </IconsDialog>

			        <IconsDialog>
				        <Form.Item geticon={this.getTrailingIcon.bind(this)} label="Trailing Icon" style={{cursor: 'pointer'}}>
				          {getFieldDecorator('Trailing Icon', {
				          	initialValue: this.widgetProps.trailingIcon, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the icon',
				              },
				            ],
				          })(<Input addonBefore="Choose icon" placeholder='Click to select file' ref={input => this.trailingIcon = input} />)}
				        </Form.Item>
			        </IconsDialog>
			    </Form>

			    { super.render() }
			</div>
		)
	}
}

const ListTileSidebar = Form.create({ name: 'register' })(ListTile);

export default ListTileSidebar


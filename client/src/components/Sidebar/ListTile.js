import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { initializeAction } from '../../utils.js'
import IconsDialog from '../IconsDialog'

class ListTile extends React.Component {
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

    getLeadingIcon(value) {
    	this.icon.input.value = value;
    	this.props.setLeadingIcon(value)
    }

    getTrailingIcon(value) {
    	this.icon.input.value = value;
    	this.props.setTrailingIcon(value)
    }
    
    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="Title">
		          {getFieldDecorator('title', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.title, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the title',
		              },
		            ],
		          })(<Input onChange={this.props.setTitle.bind(this)} />)}
		        </Form.Item>

		        <Form.Item label="Subtitle">
		          {getFieldDecorator('subtitle', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.subtitle, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the subtitle',
		              },
		            ],
		          })(<Input onChange={this.props.setSubtitle.bind(this)} />)}
		        </Form.Item>

		        <IconsDialog>
			        <Form.Item getIcon={this.getLeadingIcon.bind(this)} label="Leading Icon" style={{cursor: 'pointer'}}>
			          {getFieldDecorator('Leading Icon', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.leadingIcon, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the icon',
			              },
			            ],
			          })(<Input addonBefore="Choose icon" placeholder='Click to select file' ref={input => this.icon = input} />)}
			        </Form.Item>
		        </IconsDialog>

		        <IconsDialog>
			        <Form.Item getIcon={this.getTrailingIcon.bind(this)} label="Trailing Icon" style={{cursor: 'pointer'}}>
			          {getFieldDecorator('Trailing Icon', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.trailingIcon, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the icon',
			              },
			            ],
			          })(<Input addonBefore="Choose icon" placeholder='Click to select file' ref={input => this.icon = input} />)}
			        </Form.Item>
		        </IconsDialog>
		    </Form>
		)
	}
}

const ListTileSidebar = Form.create({ name: 'register' })(ListTile);

class ListTileActions {
	static initialize() {
		this.actions = initializeAction(['setTitle', 'setSubtitle', 'setLeadingIcon', 'setTrailingIcon'], this);
	}
}

export {
	ListTileSidebar, ListTileActions 
};


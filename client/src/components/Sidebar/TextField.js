import React, { Component } from 'react';
import { Form, Input, Select, InputNumber, Button } from 'antd';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import './TextField.css'
import { initializeAction } from '../../utils.js'
import IconsDialog from '../IconsDialog'

const { Option } = Select;
const ButtonGroup = Button.Group;

class TextField extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			bold: false,
			italic: false,
			underlined: false
		}
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
    	const { text, label } = JSON.parse(window.localStorage.currentSelection).widgetProps;

    	this.props.form.setFieldsValue({
	      text,
	      label
	    });
    }

    handleBoldClick() {
    	this.setState({bold: !this.state.bold});
    }

    handleItalicClick() {
    	this.setState({italic: !this.state.italic});
    }

    handleUnderlinedClick() {
    	this.setState({underlined: !this.state.underlined});
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
		        <Form.Item label="Text">
		          {getFieldDecorator('text', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.text, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the text',
		              },
		            ],
		          })(<Input onChange={this.props.setText} />)}
		        </Form.Item>
		        <Form.Item label="type">
		          {getFieldDecorator('type', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.type || 'Default', 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the type',
		              },
		            ],
		          })(<Select onChange={this.props.setType}>
		          	<Option value="Default">Default</Option>
		          	<Option value="Number">Number</Option>
		          	<Option value="Email">Email</Option>
		          	<Option value="Password">Password</Option>
		          	<Option value="Date">Date</Option>
		          	<Option value="Time">Time</Option>
		          </Select>)}
		        </Form.Item>

		        <div style={{display: 'flex'}}>
			        <InputNumber min={1} defaultValue={16} formatter={value => `${value}px`} parser={value => value.replace('px', '')} />
			        <ButtonGroup>
				      <Button type={ this.state.bold ? 'primary' : 'default' } onClick={this.handleBoldClick.bind(this)}>B</Button>
				      <Button type={ this.state.italic ? 'primary' : 'default' } onClick={this.handleItalicClick.bind(this)}>I</Button>
				      <Button type={ this.state.underlined ? 'primary' : 'default' } onClick={this.handleUnderlinedClick.bind(this)}>U</Button>
				    </ButtonGroup>
				    <ColorPicker color={'#000'} onChange={this.props.setColor} placement="topLeft" />
		        </div>

		        <Form.Item label="Label">
		          {getFieldDecorator('label', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.label, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the label',
		              },
		            ],
		          })(<Input onChange={this.props.setLabel} />)}
		        </Form.Item>
		        
		        <Form.Item label="Placeholder">
		          {getFieldDecorator('placeholder', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.placeholder, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the placeholder',
		              },
		            ],
		          })(<Input onChange={this.props.setPlaceholder} />)}
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

const TextFieldSidebar = Form.create({ name: 'register' })(TextField);

class TextFieldActions {
	static initialize() {
		this.actions = initializeAction(['setText', 'setType', 'setColor', 'setLabel', 'setPlaceholder', 'setLeadingIcon', 'setTrailingIcon'], this);
	}
}

export {
	TextFieldSidebar, TextFieldActions 
};


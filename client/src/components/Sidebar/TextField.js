import React, { Component } from 'react';
import { Form, Input, Select, InputNumber, Button, Switch } from 'antd';
// import ColorPicker from 'rc-color-picker';
// import 'rc-color-picker/assets/index.css';
import './TextField.css'
import { initializeAction } from '../../utils.js'
import IconsDialog from '../IconsDialog'
import { EventEmitter } from '../../utils/Events.js'
import Common from './Common'

const { Option } = Select;
// const ButtonGroup = Button.Group;

class TextField extends Common {
	constructor(props) {
		super(props);

		this.widgetProps = JSON.parse(window.localStorage.currentSelection).widgetProps
		
		this.state = {
			/*bold: false,
			italic: false,
			underlined: false*/
			outlinedBorder: this.widgetProps.outlinedBorder
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
    	const { text, label } = this.widgetProps;

    	this.props.form.setFieldsValue({
	      text,
	      label
	    });
    }

    /*handleBoldClick() {
    	this.setState({bold: !this.state.bold});
    }

    handleItalicClick() {
    	this.setState({italic: !this.state.italic});
    }

    handleUnderlinedClick() {
    	this.setState({underlined: !this.state.underlined});
    }*/

    getIcon(value) {
    	this.icon.input.value = value;
    	// this.props.setLeadingIcon(value)
    	EventEmitter.dispatch('setIcon', value)
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

    handleSetOutlinedBorder(value) {
    	this.setState({outlinedBorder: value})

    	EventEmitter.dispatch('setOutlinedBorder', value)
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<React.Fragment>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Text">
			          {getFieldDecorator('text', {
			          	initialValue: this.widgetProps.text, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the text',
			              },
			            ],
			          })(<Input onChange={ event => EventEmitter.dispatch('setText', event.target.value) } />)}
			        </Form.Item>
			        <Form.Item label="type">
			          {getFieldDecorator('type', {
			          	initialValue: this.widgetProps.type || 'Default', 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the type',
			              },
			            ],
			          })(<Select onChange={ value => EventEmitter.dispatch('setType', value) }>
			          	<Option value="Default">Default</Option>
			          	<Option value="Number">Number</Option>
			          	<Option value="Email">Email</Option>
			          	<Option value="Password">Password</Option>
			          	<Option value="Date">Date</Option>
			          	<Option value="Time">Time</Option>
			          </Select>)}
			        </Form.Item>

			        {/*<div style={{display: 'flex'}}>
				        <InputNumber min={1} defaultValue={16} formatter={value => `${value}px`} parser={value => value.replace('px', '')} />
				        <ButtonGroup>
					      <Button type={ this.state.bold ? 'primary' : 'default' } onClick={this.handleBoldClick.bind(this)}>B</Button>
					      <Button type={ this.state.italic ? 'primary' : 'default' } onClick={this.handleItalicClick.bind(this)}>I</Button>
					      <Button type={ this.state.underlined ? 'primary' : 'default' } onClick={this.handleUnderlinedClick.bind(this)}>U</Button>
					    </ButtonGroup>
					    <ColorPicker color={'#000'} onChange={ value => EventEmitter.dispatch('setColor', value) } placement="topLeft" />
			        </div>*/}

			        <Form.Item label="Label">
			          {getFieldDecorator('label', {
			          	initialValue: this.widgetProps.label, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the label',
			              },
			            ],
			          })(<Input onChange={ event => EventEmitter.dispatch('setLabel', event.target.value) } />)}
			        </Form.Item>
			        
			        <Form.Item label="Placeholder">
			          {getFieldDecorator('placeholder', {
			          	initialValue: this.widgetProps.placeholder, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the placeholder',
			              },
			            ],
			          })(<Input onChange={ event => EventEmitter.dispatch('setPlaceholder', event.target.value) } />)}
			        </Form.Item>

	                <IconsDialog>
	        	        <Form.Item geticon={this.getIcon.bind(this)} label="Icon" style={{cursor: 'pointer'}}>
	        	          {getFieldDecorator('icon', {
	        	          	initialValue: this.widgetProps.icon, 
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
				        <Form.Item geticon={this.getLeadingIcon.bind(this)} label="Leading Icon" style={{cursor: 'pointer'}}>
				          {getFieldDecorator('leadingIcon', {
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
				          {getFieldDecorator('trailingIcon', {
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

			        <Form.Item label="Outlined">
			          {getFieldDecorator('outlinedBorder')
			          	(<Switch checked={this.state.outlinedBorder} onChange={ this.handleSetOutlinedBorder.bind(this) } />)}
			        </Form.Item>

			        <Form.Item label="Focus Border Color">
			          {getFieldDecorator('focusBorderColor', {
			          	initialValue: this.widgetProps.focusBorderColor || 'Secondary', 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the focus border color',
			              },
			            ],
			          })(<Select onChange={ value => EventEmitter.dispatch('setFocusBorderColor', value) }>
			          		<Option value="Primary">Primary</Option>
			          		<Option value="PrimaryVariant">PrimaryVariant</Option>
			          		<Option value="Secondary">Secondary</Option>
			          		<Option value="SecondaryVariant">SecondaryVariant</Option>
			          		<Option value="Background">Background</Option>
			          		<Option value="Button">Button</Option>
			          		<Option value="Surface">Surface</Option>
			          		<Option value="Error">Error</Option>
			          		<Option value="OnPrimary">OnPrimary</Option>
			          		<Option value="OnSecondary">OnSecondary</Option>
			          		<Option value="OnBackground">OnBackground</Option>
			          		<Option value="OnSurface">OnSurface</Option>
			          		<Option value="OnError">OnError</Option>
			          </Select>)}
			        </Form.Item>
			    </Form>

		        { super.render() }
		    </React.Fragment>
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


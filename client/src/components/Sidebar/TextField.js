import React, { Component } from 'react';
import { Form, Input, Select, InputNumber, Button } from 'antd';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import './TextField.css'

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
    	this.props.form.setFieldsValue({
	      text: JSON.parse(window.localStorage.currentSelection).widgetProps.text,
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
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.type, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the type',
		              },
		            ],
		          })(<Select defaultValue="Default" onChange={this.props.setType}>
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
		    </Form>
		)
	}
}

const TextFieldSidebar = Form.create({ name: 'register' })(TextField);

class TextFieldActions {
	static setText(e, stageRef) {
		stageRef.setText(e.target.value);
	}

	static setType(value, stageRef) {
		stageRef.setType(value)
	}

	static setColor(value, stageRef) {
		stageRef.setColor(value)
	}
}

export {
	TextFieldSidebar, TextFieldActions 
};


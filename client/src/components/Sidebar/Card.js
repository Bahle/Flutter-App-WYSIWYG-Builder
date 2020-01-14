import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import ImageDialog from './ImageDialog'
import { initializeAction } from '../../utils.js'

const { Option } = Select;

class Card extends React.Component {
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
    	const { source, stretchMode } = JSON.parse(window.localStorage.currentSelection).widgetProps;

    	this.props.form.setFieldsValue({
	      source,
	      stretchMode,
	    });
    }

    componentDidMount() {
    	this.source.input.setAttribute('readonly', 'readonly')
    }

    getImage(value) {
    	// alert('getImage: ' + value)
    	// console.dir(this.source)
    	this.source.input.value = value;

    	this.props.setImage(value)
    }

    handleSelectStretchMode(value) {
    	alert(value)

    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <ImageDialog>
			        <Form.Item getImage={this.getImage.bind(this)} label="Source" style={{cursor: 'pointer'}}>
			          {getFieldDecorator('source', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.image, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the source',
			              },
			            ],
			          })(<Input addonBefore="Choose file" placeholder='Click to select file' ref={input => this.source = input} />)}
			        </Form.Item>
		        </ImageDialog>

		        <Form.Item label="Title">
		          {getFieldDecorator('title', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.title, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the title',
		              },
		            ],
		          })(<Input onChange={this.props.setTitle} />)}
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
		          })(<Input onChange={this.props.setSubtitle} />)}
		        </Form.Item>

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

		    {/* begin here by make array.map of icons */}
		    </Form>
		)
	}
}

const CardSidebar = Form.create({ name: 'register' })(Card);

class CardActions {
	static initialize() {
		this.actions = initializeAction(['setImage', 'setTitle', 'setSubtitle', 'setText', 'setActions', 'setHeaderActions'], this);
	}
}

export {
	CardSidebar, CardActions 
};


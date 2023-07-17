import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { initializeAction } from '../../../utils.js'
import { EventEmitter } from '../../../utils/Events.js'
import IconsDialog from '../../IconsDialog'
import ImageDialog from '../ImageDialog'
import Common from '../Common'

class RaisedButton extends Common {
	constructor(props) {
		super(props);

		this.widgetProps = JSON.parse(window.localStorage.currentSelection).widgetProps;
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

    getIcon(value) {
    	this.icon.input.value = value;
    	EventEmitter.dispatch('setIcon', value)
    }

    getImage(value) {
    	this.source.input.value = value;

    	EventEmitter.dispatch('setImage', value)
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
			                message: 'Please input the button text',
			              },
			            ],
			          })(<Input onChange={ event => EventEmitter.dispatch('setText', event.target.value) } />)}
			        </Form.Item>
			    </Form>

	            <IconsDialog>
	    	        <Form.Item geticon={this.getIcon.bind(this)} label="Icon" style={{cursor: 'pointer'}}>
	    	          {getFieldDecorator('Icon', {
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

	            <ImageDialog>
			        <Form.Item getImage={this.getImage.bind(this)} label="Source" style={{cursor: 'pointer'}}>
			          {getFieldDecorator('source', {
			          	initialValue: this.widgetProps.image, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the source',
			              },
			            ],
			          })(<Input addonBefore="Choose file" placeholder='Click to select file' ref={input => this.source = input} />)}
			        </Form.Item>
		        </ImageDialog>

			    { super.render() }
			</React.Fragment>
		)
	}
}

const RaisedButtonSidebar = Form.create({ name: 'register' })(RaisedButton);

export default RaisedButtonSidebar


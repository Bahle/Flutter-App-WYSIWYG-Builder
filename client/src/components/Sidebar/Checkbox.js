import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'

const { TextArea } = Input;

class Checkbox extends React.Component {
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
	      options: JSON.parse(window.localStorage.currentSelection).widgetProps.options,
	      subtitles: JSON.parse(window.localStorage.currentSelection).widgetProps.subtitles,
	    });
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="Text">
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

		        <Form.Item label="subtitles">
		          {getFieldDecorator('subtitles', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.subtitles, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the subtitles',
		              },
		            ],
		          })(<TextArea row={5} style={{height: '150px'}} onChange={ event => EventEmitter.dispatch('setSubtitles', event.target.value) } />)}
		        </Form.Item>
		    </Form>
		)
	}
}

const CheckboxSidebar = Form.create({ name: 'register' })(Checkbox);

export default CheckboxSidebar;


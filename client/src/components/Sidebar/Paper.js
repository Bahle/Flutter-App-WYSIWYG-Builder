import React, { Component } from 'react';
import { Form, InputNumber } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'
import Common from './Common'

class Paper extends Common {
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
	      elevation: JSON.parse(window.localStorage.currentSelection).widgetProps.elevation,
	    });
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<div>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Elevation">
			          {getFieldDecorator('elevation', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.elevation, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the elevation',
			              },
			            ],
			          })(<InputNumber step={1} min={0} onChange={ event => EventEmitter.dispatch('setElevation', event.target.value) } />)}
			        </Form.Item>
			    </Form>

			    { super.render() }
			</div>
		)
	}
}

const PaperSidebar = Form.create({ name: 'register' })(Paper);

class PaperActions {
	static initialize() {
		this.actions = initializeAction(['setElevation'], this);
	}
}

export {
	PaperSidebar, PaperActions 
};


import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'

const { Option } = Select

class Widget extends React.Component {
	constructor(props) {
		super(props);

		const currentSelection = JSON.parse(window.localStorage.currentSelection);
		this.widgetProps = currentSelection.widgetProps;
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
	      orientation: this.widgetProps.orientation,
	    });
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<React.Fragment>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Orientation">
			          {getFieldDecorator('orientation', {
			          	initialValue: this.widgetProps.orientation || 'vertical', 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the orientation',
			              },
			            ],
			          })(
				          <Select onChange={ value => EventEmitter.dispatch('setOrientation', value) }>
				          	<Option value="vertical">Vertical</Option>
				          	<Option value="horizontal">Horizontal</Option>
				          </Select>
			          )}
			        </Form.Item>
			    </Form>
		    </React.Fragment>
		)
	}
}

const WidgetSidebar = Form.create({ name: 'register' })(Widget);

export default WidgetSidebar;


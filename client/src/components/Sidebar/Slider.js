import React, { Component } from 'react';
import { Form, InputNumber, Switch } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'

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
	      text: this.widgetProps.text,
	    });
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<React.Fragment>
				<Form {...this.formItemLayout}>
					<Form.Item label="Show label">
			          {getFieldDecorator('showLabel')
			          	(<Switch defaultChecked={this.widgetProps.showLabel} onChange={checked => EventEmitter.dispatch('setShowLabel', checked)} />)}
			        </Form.Item>

			        <Form.Item label="Min">
			          {getFieldDecorator('min', {
			          	initialValue: this.widgetProps.min, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the min',
			              },
			            ],
			          })(<InputNumber onChange={ value => EventEmitter.dispatch('setMin', value) } />)}
			        </Form.Item>

		            <Form.Item label="Max">
		              {getFieldDecorator('max', {
		              	initialValue: this.widgetProps.max, 
		                rules: [
		                  {
		                    required: true,
		                    message: 'Please input the max',
		                  },
		                ],
		              })(<InputNumber onChange={ value => EventEmitter.dispatch('setMax', value) } />)}
		            </Form.Item>

			    	<Form.Item label="Divisions">
		              {getFieldDecorator('divisions', {
		              	initialValue: this.widgetProps.divisions, 
		                rules: [
		                  {
		                    required: true,
		                    message: 'Please input the divisions',
		                  },
		                ],
		              })(<InputNumber min={0} onChange={ value => EventEmitter.dispatch('setDivisions', value) } />)}
		            </Form.Item>

		            <Form.Item label="Range Slider">
			          {getFieldDecorator('isRangeSlider')
			          	(<Switch defaultChecked={this.widgetProps.isRangeSlider} onChange={checked => EventEmitter.dispatch('setIsRangeSlider', checked)} />)}
			        </Form.Item>
			    </Form>
		    </React.Fragment>
		)
	}
}

const WidgetSidebar = Form.create({ name: 'register' })(Widget);

export default WidgetSidebar


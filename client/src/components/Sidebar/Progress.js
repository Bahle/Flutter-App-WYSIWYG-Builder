import React, { Component } from 'react';
import { Form, Select, Switch } from 'antd';
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
			        <Form.Item label="Type">
			          {getFieldDecorator('type', {
			          	initialValue: this.widgetProps.type || 'Linear', 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the type',
			              },
			            ],
			          })(
				          <Select onChange={ value => EventEmitter.dispatch('setType', value) }>
				          	<Option value="Linear">Linear</Option>
				          	<Option value="Circular">Circular</Option>
				          </Select>
			          )}
			        </Form.Item>

			        <Form.Item label="Color">
			          {getFieldDecorator('color', {
			          	initialValue: this.widgetProps.color || 'Primary', 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the color',
			              },
			            ],
			          })(<Select onChange={ value => EventEmitter.dispatch('setColor', value) }>
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

			        <Form.Item label="Determinate">
			          {getFieldDecorator('isDeterminate')
			          	(<Switch defaultChecked={this.widgetProps.isDeterminate} onChange={checked => EventEmitter.dispatch('setIsDeterminate', checked)} />)}
			        </Form.Item>
			    </Form>
		    </React.Fragment>
		)
	}
}

const WidgetSidebar = Form.create({ name: 'register' })(Widget);

export default WidgetSidebar;


import React, { Component } from 'react';
import { Form, Input, Select, InputNumber } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'
import Common from './Common'

const { Option } = Select

class Container extends Common {
	constructor(props) {
		super(props);

		console.log('Container props: ', props)
		// super.setInkwell()

		this.currentSelection = JSON.parse(window.localStorage.currentSelection);
		this.widgetProps = this.currentSelection.widgetProps
		this.models = JSON.parse(window.localStorage.modelData).map(({name}) => name)

		this.state = {
			type: this.widgetProps.type,
			columnCount: this.widgetProps.gridCount,
			horizontalSpacing: this.widgetProps.horizontalSpacing,
			verticalSpacing: this.widgetProps.verticalSpacing
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
	      type: this.widgetProps.type || 'Column',
	      // innerHeight: this.widgetProps.innerHeight,
	      model: this.widgetProps.model,
	    });
    }

    handleTypeChange(value) {
    	this.setState({type: value})
    	alert('set fucking type: ' + value)
    	EventEmitter.dispatch('setType', value)
    	EventEmitter.dispatch('togglePageView', window.localStorage.pageView)
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

	    return(
			<React.Fragment>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Type">
			          {getFieldDecorator('type', {
			          	initialValue: this.widgetProps.type || 'Column', 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the type',
			              },
			            ],
			          })(
				          <Select onChange={ this.handleTypeChange.bind(this) }>
				          	<Option value="Column">Column</Option>
				          	<Option value="ListView">ListView</Option>
				          	<Option value="GridView">GridView</Option>
				          	<Option value="Row">Row</Option>
				          	<Option value="Wrap">Wrap</Option>
				          </Select>
			          )}
			        </Form.Item>

			        {/* this.state.type == 'ListView' && <Form.Item label="Inner Height">
			          {getFieldDecorator('height', {
			          	initialValue: this.widgetProps.innerHeight || this.currentSelection.innerHeight, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the inner height',
			              },
			            ],
			          })(<InputNumber step={10} onChange={value => EventEmitter.dispatch('setInnerHeight', value) } />)}
			        </Form.Item> */}

			        { this.state.type == 'GridView' && <Form.Item label="Column Count">
			          {getFieldDecorator('columnCount', {
			          	initialValue: this.widgetProps.columnCount || 3, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the inner column count',
			              },
			            ],
			          })(<InputNumber step={1} onChange={value => /*{alert(value);*/ EventEmitter.dispatch('setColumnCount', value) /*}*/ } />)}
			        </Form.Item> }

			        <Form.Item label="Model">
			          {getFieldDecorator('model', {
			          	initialValue: this.widgetProps.model, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the model',
			              },
			            ],
			          })(
				          <Select onChange={ value => EventEmitter.dispatch('setModel', value) }>
				          	{ this.models.map(model => <Option key={model} value={model}>{model}</Option>) }
				          </Select>
			          )}
			        </Form.Item>
			    </Form>


		    	{
		    		window.localStorage.setItem('+inkwell', 'true') || setTimeout(() => window.localStorage.removeItem('+inkwell'), 100) && super.render()
		    	}
		    </React.Fragment>
		)
	}
}

const ContainerSidebar = Form.create({ name: 'register', fuck: true })(Container);

export default ContainerSidebar;


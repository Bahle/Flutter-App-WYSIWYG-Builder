import React, { Component } from 'react';
import { Form, Input, Select, Switch } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'
import Common from './Common'

const { Option } = Select

class Text extends Common {
	constructor(props) {
		super(props);

		const currentSelection = JSON.parse(window.localStorage.currentSelection);
		this.widgetProps = currentSelection.widgetProps;
		// alert(window.localStorage.currentSelection)
		// console.dir(JSON.parse(window.localStorage['stage_' + currentSelection.grandParentStage])[currentSelection.stageId].widgetProps.model)
		if(currentSelection.grandParentStage && currentSelection.stageId) {
			const temp = JSON.parse(window.localStorage['stage_' + currentSelection.grandParentStage])[currentSelection.stageId]

			this.model = temp && temp.widgetProps.model // get model in parent container widget
		} else {
			const temp = JSON.parse(window.localStorage['stage_' + currentSelection.stageId]).widgetProps;
			this.model = temp && temp.model // get model in parent container widget
		}

		if(this.model) {
			this.modelFields = JSON.parse(window.localStorage.modelData).find(model => model.name == this.model).fields
		}

		this.state = {
			textWrap: this.widgetProps.textWrap
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
	      text: this.widgetProps.text,
	      fontSize: this.widgetProps.fontSize,
	      wrap: this.widgetProps.setTextWrap,
	      modelField: this.widgetProps.modelField,
	    });
    }

    handleTextWrapChange(value) {
    	EventEmitter.dispatch('setTextWrap', value)

    	this.setState({textWrap: value})
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

			        <Form.Item label="Font Size">
			          {getFieldDecorator('fontSize', {
			          	initialValue: this.widgetProps.fontSize || 'body1', 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the font size',
			              },
			            ],
			          })(<Select onChange={ value => EventEmitter.dispatch('setFontSize', value) }>
			          		<Option value="h1">h1</Option>
        	          		<Option value="h2">h2</Option>
        	          		<Option value="h3">h3</Option>
        	          		<Option value="h4">h4</Option>
        	          		<Option value="h5">h5</Option>
        	          		<Option value="h6">h6</Option>
        	          		<Option value="subtitle1">subtitle1</Option>
        	          		<Option value="subtitle2">subtitle2</Option>
        	          		<Option value="body1">body1</Option>
        	          		<Option value="body2">body2</Option>
        	          		<Option value="button">button</Option>
        	          		<Option value="caption">caption</Option>
        	          		<Option value="overline">overline</Option>
        	          </Select>)}
			        </Form.Item>

			        <Form.Item label="Text wrap">
			          {getFieldDecorator('textWrap', {
			          	initialValue: this.widgetProps.textWrap, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the text wrap',
			              },
			            ],
			          })(<Switch checked={this.state.textWrap} onChange={ this.handleTextWrapChange.bind(this) } />)}
			        </Form.Item>

		            {
		            	this.model  && <Form.Item label="Model Field">
		                  {getFieldDecorator('modelField', {
		                  	initialValue: this.widgetProps.modelField, 
		                    rules: [
		                      {
		                        required: true,
		                        message: 'Please input the model field',
		                      },
		                    ],
		                  })(
		        	          <Select onChange={ value => EventEmitter.dispatch('setModelField', value) }>
		        	          	{
		        	          		this.modelFields.map(({fieldName}) => {
		        	          			return <Option key={fieldName} value={fieldName}>{fieldName}</Option>
		        	          		})
		        	          	}
		        	          </Select>
		                  )}
		                </Form.Item>
		            }
			    </Form>

			    { super.render() }
		    </React.Fragment>
		)
	}
}

const TextSidebar = Form.create({ name: 'register' })(Text);

export default TextSidebar


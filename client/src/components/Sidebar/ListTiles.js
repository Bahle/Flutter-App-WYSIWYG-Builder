import React, { Component } from 'react';
import { Form, Input, Button, Switch, Select, Collapse } from 'antd';
import { initializeAction } from '../../utils.js'
import IconsDialog from '../IconsDialog'
import { EventEmitter } from '../../utils/Events.js'
import Common from './Common'

const MaterialIcons = require('@material-ui/icons')

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

class ListTile extends Common {
	constructor(props) {
		super(props);

		this.widgetProps = JSON.parse(window.localStorage.currentSelection).widgetProps;
		this.models = JSON.parse(window.localStorage.modelData).map(({name}) => name)

		this.state = {
			trailingIcons: this.widgetProps.trailingIcons || [],
            leadingIcons: this.widgetProps.leadingIcons || [],
            modelFields: this.widgetProps.model ? JSON.parse(window.localStorage.modelData).find(model => model.name == this.widgetProps.model).fields : null
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
	      titles: this.widgetProps.titles,
	      subtitles: this.widgetProps.subtitles,
	      leadingIcons: this.widgetProps.leadingIcons,
	      trailingIcons: this.widgetProps.trailingIcons,
	    });
    }

    /*getLeadingIcon(value) {
    	this.icon.input.value = value;
    	// this.props.setLeadingIcon(value)
    	EventEmitter.dispatch('setLeadingIcons', value)
    }

    getTrailingIcon(value) {
    	this.icon.input.value = value;
    	// this.props.setTrailingIcon(value)
    	EventEmitter.dispatch('setTrailingIcons', value)
    }*/
    
    handleAddAction(type, icon) {
    	let { [type]: actions } = this.state;
    	actions.push(icon)
    	this.setState({[type]: actions})

    	EventEmitter.dispatch(`set${type.ucFirst()}`, actions)
    }

    handleClearActions(type) {
    	if(window.confirm(`Are you sure you want to clear ${type}?`)) {
    		this.setState({[type]: []})
    	}

    	EventEmitter.dispatch(`set${type.ucFirst()}`, [])
    }

    handleChangeAction(index, type, icon) {
    	let { [type]: actions } = this.state;
    	actions[index] = icon
    	this.setState({[type]: actions})

    	EventEmitter.dispatch(`set${type.ucFirst()}`, actions)
    }

    handleSetModel(value) {
    	EventEmitter.dispatch('setModel', value)

    	// console.log('value: ', value)
    	// console.log('check: ', JSON.parse(window.localStorage.modelData).find(model => model.name == value).fields);

    	this.setState({modelFields: JSON.parse(window.localStorage.modelData).find(model => model.name == value)?.fields})
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<div>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Titles">
			          {getFieldDecorator('titles', {
			          	initialValue: this.widgetProps.titles, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the titles',
			              },
			            ],
			          })(<TextArea onChange={ event => EventEmitter.dispatch('setTitles', event.target.value) } />)} {/*this.props.setTitle.bind(this)*/}
			        </Form.Item>

			        <Form.Item label="Subtitles">
			          {getFieldDecorator('subtitles', {
			          	initialValue: this.widgetProps.subtitles, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the subtitles',
			              },
			            ],
			          })(<TextArea onChange={ event => EventEmitter.dispatch('setSubtitles', event.target.value) } />)}
			        </Form.Item>

			        <Form.Item label="Leading icons">
		              {getFieldDecorator('leadingIcons')(<div style={{display: 'flex'}}>
		              		{
		              			this.state.leadingIcons && this.state.leadingIcons.map((icon, i) => {
		              				return (<IconsDialog key={icon + i}>
		              					<Button geticon={this.handleChangeAction.bind(this, i, 'leadingIcons')}>
		              						{ icon && React.createElement(MaterialIcons[icon]) }
		              					</Button>
		              				</IconsDialog>)
		              			})
		              		}

		              		<IconsDialog>
		              			{ <Button style={{fontSize: '21px'}} geticon={this.handleAddAction.bind(this, 'leadingIcons')}>+</Button> }
		              		</IconsDialog>

		              		<Button onClick={this.handleClearActions.bind(this, 'leadingIcons')}>X</Button>
		              	</div>)}
		            </Form.Item>

		            <Form.Item label="Trailing icons">
		              {getFieldDecorator('trailingIcons')(<div style={{display: 'flex'}}>
		              		{
		              			this.state.trailingIcons && this.state.trailingIcons.map((icon, i) => {
		              				return (<IconsDialog key={icon + i}>
		              					<Button geticon={this.handleChangeAction.bind(this, i, 'trailingIcons')}>
		              						{ icon && React.createElement(MaterialIcons[icon]) }
		              					</Button>
		              				</IconsDialog>)
		              			})
		              		}

		              		<IconsDialog>
		              			{ <Button style={{fontSize: '21px'}} geticon={this.handleAddAction.bind(this, 'trailingIcons')}>+</Button> }
		              		</IconsDialog>

		              		<Button onClick={this.handleClearActions.bind(this, 'trailingIcons')}>X</Button>
		              	</div>)}
		            </Form.Item>

		            <Form.Item label="Trailing checkbox">
			          {getFieldDecorator('trailingCheckbox')
			          	(<Switch checked={!!this.widgetProps.trailingCheckbox} onChange={value => EventEmitter.dispatch('setTrailingCheckbox', value)} />)}
			        </Form.Item>

			        <Form.Item label="Trailing switch">
			          {getFieldDecorator('Trailing switch')
			          	(<Switch checked={!!this.widgetProps.trailingSwitch} onChange={value => EventEmitter.dispatch('setTrailingSwitch', value)} />)}
			        </Form.Item>

			        <Collapse>
			            <Panel header="Model" key="1">
					        <Form.Item label="Model">
					          {getFieldDecorator('model', {
					          	initialValue: this.widgetProps.model, 
					          })(
						          <Select onChange={ this.handleSetModel.bind(this) }>
						          	<Option value="">None</Option>
						          	{ this.models.map(model => <Option key={model} value={model}>{model}</Option>) }
						          </Select>
					          )}
					        </Form.Item>

				            {
				            	this.state.modelFields && <React.Fragment>
					            	<Form.Item label="Title Model Field">
					                  {getFieldDecorator('titleModel', {
					                  	initialValue: this.widgetProps.titleModelField, 
					                  })(
					        	          <Select onChange={ value => EventEmitter.dispatch('setTitleModelField', value) }>
					        	          	<Option value="">None</Option>
					        	          	{
					        	          		this.state.modelFields.map(({fieldName}) => {
					        	          			return <Option key={fieldName} value={fieldName}>{fieldName}</Option>
					        	          		})
					        	          	}
					        	          </Select>
					                  )}
					                </Form.Item>
					                <Form.Item label="Subtitle Model Field">
					                  {getFieldDecorator('subtitleModel', {
					                  	initialValue: this.widgetProps.subtitleModelField, 
					                  })(
					        	          <Select onChange={ value => EventEmitter.dispatch('setSubtitleModelField', value) }>
					        	          	<Option value="">None</Option>
					        	          	{
					        	          		this.state.modelFields.map(({fieldName}) => {
					        	          			return <Option key={fieldName} value={fieldName}>{fieldName}</Option>
					        	          		})
					        	          	}
					        	          </Select>
					                  )}
					                </Form.Item>
					                <Form.Item label="Leading Model Field">
					                  {getFieldDecorator('leadingModel', {
					                  	initialValue: this.widgetProps.leadingModelField, 
					                  })(
					        	          <Select onChange={ value => EventEmitter.dispatch('setLeadingModelField', value) }>
					        	          	<Option value="">None</Option>
					        	          	{
					        	          		this.state.modelFields.map(({fieldName}) => {
					        	          			return <Option key={fieldName} value={fieldName}>{fieldName}</Option>
					        	          		})
					        	          	}
					        	          </Select>
					                  )}
					                </Form.Item>
					                <Form.Item label="Trailing Model Field">
					                  {getFieldDecorator('trailingModel', {
					                  	initialValue: this.widgetProps.trailingModelField, 
					                  })(
					        	          <Select onChange={ value => EventEmitter.dispatch('setTrailingModelField', value) }>
					        	          	<Option value="">None</Option>
					        	          	{
					        	          		this.state.modelFields.map(({fieldName}) => {
					        	          			return <Option key={fieldName} value={fieldName}>{fieldName}</Option>
					        	          		})
					        	          	}
					        	          </Select>
					                  )}
					                </Form.Item>
				                </React.Fragment>
				            }
				        </Panel>
				    </Collapse>
			    </Form>

			    { super.render() }
			</div>
		)
	}
}

const ListTileSidebar = Form.create({ name: 'register' })(ListTile);

export default ListTileSidebar


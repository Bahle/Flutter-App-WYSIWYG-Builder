import React, { Component } from 'react';
import { Form, Input, Select, InputNumber, Button, Switch } from 'antd';
import ImageDialog from './ImageDialog'
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'
import IconsDialog from '../IconsDialog'

const MaterialIcons = require('@material-ui/icons')

const { Option } = Select;
const { TextArea } = Input;

class Card extends React.Component {
	constructor(props) {
		super(props);

		const currentSelection = JSON.parse(window.localStorage.currentSelection);
		this.widgetProps = JSON.parse(window.localStorage.currentSelection).widgetProps

		if(currentSelection.grandParentStage && currentSelection.stageId) {
			const temp = JSON.parse(window.localStorage['stage_' + currentSelection.grandParentStage])[currentSelection.stageId]

			this.model = temp && temp.widgetProps.model // get model in parent container widget
		} else {
			const temp = JSON.parse(window.localStorage['stage_' + currentSelection.stageId]).widgetProps;
			this.model = temp && temp.model // get model in parent container widget
		}

		if(this.model) {
			this.modelFields = JSON.parse(window.localStorage.modelData).find(model => model.name == this.model).fields
			this.modelFieldsSelect = this.modelFields.map((field,i) => {
				return <Option key={field.fieldName + i} value={field.fieldName}>{field.fieldName}</Option>
			})
		}

		this.state = {
			actionIcons: this.widgetProps.actionIcons || [],
			useModel: this.widgetProps.useModel === undefined ? true : this.widgetProps.useModel //if undefined true, else check value
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
    	const { source, stretchMode } = this.widgetProps;

    	this.props.form.setFieldsValue({
	      source,
	      stretchMode,
	    });
    }

    componentDidMount() {
    	/*this.image.input.setAttribute('readonly', 'readonly')
    	this.avatar.input.setAttribute('readonly', 'readonly')*/
    }

    getImage(type, value) {
    	this[type].input.value = value;

    	//? this.props.setImage(value)
    	EventEmitter.dispatch(`set${type.ucFirst()}`, value)
    }

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

    handleUseModel(value) {
		EventEmitter.dispatch('setUseModel', value)
		this.setState({useModel: value})
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        {
		        	!this.state.useModel
		        		? <ImageDialog>
		    		        <Form.Item getImage={this.getImage.bind(this, 'image')} label="image" style={{cursor: 'pointer'}}>
		    		          {getFieldDecorator('image', {
		    		          	initialValue: this.widgetProps.image, 
		    		            rules: [
		    		              {
		    		                required: true,
		    		                message: 'Please input the image',
		    		              },
		    		            ],
		    		          })(<Input addonBefore="Choose file" placeholder='Click to select file' ref={input => this.image = input} />)}
		    		        </Form.Item>
	    	        	</ImageDialog>
	    	        	: <Form.Item label="Image">
					          {getFieldDecorator('image', {
					          	initialValue: this.widgetProps.image, 
					            rules: [
					              {
					                required: true,
					                message: 'Please input the image',
					              },
					            ],
					          })(<Select onChange={ value => EventEmitter.dispatch('setImage', value) }>
					          	{ this.modelFieldsSelect && this.modelFieldsSelect }
					          </Select>)}
					      </Form.Item>
    	        }

		        <Form.Item label="Title">
		          {getFieldDecorator('title', {
		          	initialValue: this.widgetProps.title, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the title',
		              },
		            ],
		          })(<Input onChange={ event => EventEmitter.dispatch('setTitle', event.target.value) } />)}
		        </Form.Item>

		        <Form.Item label="Subtitle">
		          {getFieldDecorator('subtitle', {
		          	initialValue: this.widgetProps.subtitle, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the subtitle',
		              },
		            ],
		          })(<Input onChange={ event => EventEmitter.dispatch('setSubtitle', event.target.value) } />)}
		        </Form.Item>

		        <Form.Item label="Text">
		          {getFieldDecorator('text', {
		          	initialValue: this.widgetProps.text, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the text',
		              },
		            ],
		          })(<Input onChange={event => EventEmitter.dispatch('setText', event.target.value)} />)}
		        </Form.Item>

		    	{/*avatar, headerAction, mediaHeight*/}

    	        <ImageDialog>
    		        <Form.Item getImage={this.getImage.bind(this, 'avatar')} label="Avatar" style={{cursor: 'pointer'}}>
    		          {getFieldDecorator('avatar', {
    		          	initialValue: this.widgetProps.avatar, 
    		            rules: [
    		              {
    		                required: true,
    		                message: 'Please input the avatar',
    		              },
    		            ],
    		          })(<Input addonBefore="Choose file" placeholder='Click to select file' ref={input => this.avatar = input} />)}
    		        </Form.Item>
    	        </ImageDialog>

		        <Form.Item label="Media height">
  				  {getFieldDecorator('mediaHeight', {
  				  	initialValue: this.widgetProps.mediaHeight, 
  				  })(<InputNumber min={0} step={10} onChange={value => EventEmitter.dispatch('setMediaHeight', value)} />)}
  				</Form.Item>

		        <Form.Item label="Action text">
		          {getFieldDecorator('actionText', {
		          	initialValue: this.widgetProps.actionText, 
		          })(<TextArea onChange={event => EventEmitter.dispatch('setActionText', event.target.value)} />)}
		        </Form.Item>

		        <Form.Item label="Action icons">
	            	{getFieldDecorator('actionIcons')(<div style={{display: 'flex'}}>
	              		{
	              			this.state.actionIcons && this.state.actionIcons.map((icon, i) => {
	              				return (<IconsDialog key={icon + i}>
	              					<Button geticon={this.handleChangeAction.bind(this, i, 'actionIcons')}>
	              						{ icon && React.createElement(MaterialIcons[icon]) }
	              					</Button>
	              				</IconsDialog>)
	              			})
	              		}

	              		<IconsDialog>
	              			{ <Button style={{fontSize: '21px'}} geticon={this.handleAddAction.bind(this, 'actionIcons')}>+</Button> }
	              		</IconsDialog>

	              		<Button onClick={this.handleClearActions.bind(this, 'actionIcons')}>X</Button>
	              	</div>)}
	            </Form.Item>

	            <Form.Item label="Use model">
  				  {getFieldDecorator('useModel', {
  				  })(<Switch checked={this.state.useModel} onChange={ this.handleUseModel.bind(this) } />)}
  				</Form.Item>
		    {/* begin here by make array.map of icons */}
		    </Form>
		)
	}
}

const CardSidebar = Form.create({ name: 'register' })(Card);

export default CardSidebar;


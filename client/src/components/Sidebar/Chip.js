import React, { Component } from 'react';
import { Form, Input, Select, Button, Switch, InputNumber } from 'antd';

import { initializeAction } from '../../utils.js'
import IconsDialog from '../IconsDialog'
import ImageDialog from './ImageDialog'
import { EventEmitter } from '../../utils/Events.js'

const MaterialIcons = require('@material-ui/icons')

const { Option } = Select;
const ButtonGroup = Button.Group;
const { TextArea } = Input;

class Chip extends React.Component {
	constructor(props) {
		super(props);

		this.widgetProps = JSON.parse(window.localStorage.currentSelection).widgetProps
		
		this.state = {
			icons: this.widgetProps.icons ||  [],
	    	images: this.widgetProps.images || [],
	    	isSelectable: this.widgetProps.isSelectable,
	    	deleteIcon: this.widgetProps.deleteIcon,
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
    	const { text, label, icons, images, padding, labelColor, iconColor, backgroundColor, selectionColor, fontSize, isSelectable, deleteIcon } = this.widgetProps;

    	this.props.form.setFieldsValue({
	      text, label, icons, images, padding, labelColor, iconColor, backgroundColor, selectionColor, fontSize, isSelectable, deleteIcon
	    });
    }
	
	/*handleSetIcon(index, type, icon) {
    	let { [type]: actions } = this.state;
    	actions[index] = icon
    	this.setState({[type]: actions})

    	EventEmitter.dispatch(`set${type.ucFirst()}`, actions)
    }

    handleSetImage(value) {
    	this.image.input.value = value;

    	EventEmitter.dispatch('setImage', value)
    }*/

    handleAddIcon(icon) {
    	let { icons } = this.state;
    	icons.push(icon)
    	this.setState({icons})

    	EventEmitter.dispatch('setIcons', icons)
    }

    handleClearIcons() {
    	if(window.confirm('Are you sure you want to clear icon?')) {
    		this.setState({icon: []})
    	}

    	EventEmitter.dispatch('setIcons', [])
    }

    handleChangeIcon(index, icon) {
    	let { icons } = this.state;
    	icons[index] = icon
    	this.setState({icons})

    	EventEmitter.dispatch('setIcons', icons)
    }

    handleAddImage(image) {
    	let { images } = this.state;
    	images.push(image)
    	this.setState({images})

    	EventEmitter.dispatch('setImages', images)
    }

    handleClearImages() {
    	if(window.confirm('Are you sure you want to clear image?')) {
    		this.setState({images: []})
    	}

    	EventEmitter.dispatch('setImages', [])
    }

    handleChangeImage(index, image) {
    	let { images } = this.state;
    	images[index] = image
    	this.setState({images})

    	EventEmitter.dispatch('setImages', images)
    }

    handleSetSelectable(value) {
    	EventEmitter.dispatch('setIsSelectable', value)

    	this.setState({isSelectable: value})
    }

    handleSetDeleteIcon(value) {
    	EventEmitter.dispatch('setDeleteIcon', value)

    	this.setState({deleteIcon: value})
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="Labels">
		          {getFieldDecorator('labels', {
		          	initialValue: this.widgetProps.labels, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the labels',
		              },
		            ],
		          })(<TextArea onChange={ event => EventEmitter.dispatch('setLabels', event.target.value) } />)}
		        </Form.Item>
		        
		        <Form.Item label="Label Color">
		          {getFieldDecorator('labelColor', {
		          	initialValue: this.widgetProps.labelColor || 'OnBackground', 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the background color',
		              },
		            ],
		          })(<Select onChange={ value => EventEmitter.dispatch('setLabelColor', value) }>
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

		        <Form.Item label="Icon Color">
		          {getFieldDecorator('iconColor', {
		          	initialValue: this.widgetProps.iconColor || 'OnBackground', 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the background color',
		              },
		            ],
		          })(<Select onChange={ value => EventEmitter.dispatch('setIconColor', value) }>
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

		        <Form.Item label="Background Color">
		          {getFieldDecorator('backgroundColor', {
		          	initialValue: this.widgetProps.backgroundColor || 'Button', 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the background color',
		              },
		            ],
		          })(<Select onChange={ value => EventEmitter.dispatch('setBackgroundColor', value) }>
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

		        <Form.Item label="Selection Color">
		          {getFieldDecorator('selectionColor', {
		          	initialValue: this.widgetProps.selectionColor || 'Secondary', 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the selection color',
		              },
		            ],
		          })(<Select onChange={ value => EventEmitter.dispatch('setSelectionColor', value) }>
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

		        <Form.Item label="Icons">
                  {getFieldDecorator('Icons')(<div style={{display: 'flex'}}>
                  		{
                  			this.state.icons && this.state.icons.map((icon, i) => {
                  				return (<IconsDialog key={icon}>
                  					<Button geticon={this.handleChangeIcon.bind(this, i)}>
                  						{ React.createElement(MaterialIcons[icon]) }
                  					</Button>
                  				</IconsDialog>)
                  			})
                  		}

                  		<IconsDialog>
                  			{ <Button style={{fontSize: '21px'}} geticon={this.handleAddIcon.bind(this)}>+</Button> }
                  		</IconsDialog>

                  		<Button onClick={this.handleClearIcons.bind(this)}>X</Button>
                  	</div>)}
                </Form.Item>

                <Form.Item label="Images">
                  {getFieldDecorator('Images')(<div style={{display: 'flex'}}>
                  		{
                  			this.state.images && this.state.images.map((image, i) => {
                  				return (<ImageDialog key={image}>
                  					<Button getIcon={this.handleChangeImage.bind(this, i)}>
                  						<img width="30" src={`/Projects${image}`} />
                  					</Button>
                  				</ImageDialog>)
                  			})
                  		}

                  		<ImageDialog>
                  			{ <Button style={{fontSize: '21px'}} getImage={this.handleAddImage.bind(this)}>+</Button> }
                  		</ImageDialog>

                  		<Button onClick={this.handleClearImages.bind(this)}>X</Button>
                  	</div>)}
                </Form.Item>

                <Form.Item label="FontSize">
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

				<Form.Item label="Is selectable">
				  {getFieldDecorator('isSelectable')
				  	(<Switch checked={this.state.isSelectable} onChange={ this.handleSetSelectable.bind(this) } />)}
				</Form.Item>

				<Form.Item label="Delete Icon">
				  {getFieldDecorator('deleteIcon')
				  	(<Switch checked={this.state.deleteIcon} onChange={ this.handleSetDeleteIcon.bind(this) } />)}
				</Form.Item>

				<Form.Item label="Padding">
				  {getFieldDecorator('padding', {
				  	initialValue: this.widgetProps.padding || 0, 
				    rules: [
				      {
				        required: true,
				        message: 'Please input the padding',
				      },
				    ],
				  })(<InputNumber onChange={ value => EventEmitter.dispatch('setPadding', value) } />)}
				</Form.Item>
		    </Form>
		)
	}
}

const ChipSidebar = Form.create({ name: 'register' })(Chip);

export default ChipSidebar

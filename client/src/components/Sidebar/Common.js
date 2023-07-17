import React, { Component } from 'react';
import { Form, Input, InputNumber, Select, Collapse, Switch } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'

const { Option } = Select
const { Panel } = Collapse
const { TextArea } = Input

class Common extends React.Component {
	constructor(props) {
		super(props);

		console.dir('Common props: ', props)

		this.currentSelection = JSON.parse(window.localStorage.currentSelection);
		this.widgetProps = this.currentSelection.widgetProps;

		this.state = {
			eventType: this.currentSelection.widgetProps.eventType,
			popupType: this.currentSelection.widgetProps.popupType,
			inkwell: this.widgetProps.inkwell
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
	      borderWidth: this.widgetProps.borderWidth,
	      borderRadius: this.widgetProps.borderRadius, 
	      borderColor: this.widgetProps.borderColor || 'Primary',
	      elevation: this.widgetProps.elevation,
	      opacity: this.widgetProps.opacity || 1,
	      color: this.widgetProps.color || 'OnBackground'
	    });
    }

    handleEventChange(value) {
    	this.setState({eventType: value})

    	EventEmitter.dispatch('setEventType', value)
    }

    handlePopupTypeChange(value) {
    	this.setState({popupType: value})

    	EventEmitter.dispatch('setPopupType', value)
    }

    handleSetInkwell(value) {
    	EventEmitter.dispatch('setInkwell', value)

    	this.setState({inkwell: value})
    }

    render(params) {
	    const { getFieldDecorator } = this.props.form;
	    const self = this;

	    return(
			<Collapse>
			    <Panel header="Shape props" key="1">
					<Form {...this.formItemLayout}>
						<Form.Item label="x">
				          {getFieldDecorator('x', {
				          	initialValue: this.currentSelection.x, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the x coordinate',
				              },
				            ],
				          })(<InputNumber min={0} step={3} onChange={ value => EventEmitter.dispatch('setX', value) } />)}
				        </Form.Item>

				        <Form.Item label="y">
				          {getFieldDecorator('y', {
				          	initialValue: this.currentSelection.y, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the y coordinate',
				              },
				            ],
				          })(<InputNumber min={0} step={3} onChange={ value => EventEmitter.dispatch('setY', value) } />)}
				        </Form.Item>

						{
						 	window.localStorage["+inkwell"] && <Form.Item label="Inkwell">
					          {getFieldDecorator('inkwell', {
					          	/*initialValue: this.widgetProps.borderWidth, 
					            rules: [
					              {
					                required: true,
					                message: 'Please input the border width',
					              },
					            ],*/
					          })(<Switch checked={!!this.state.inkwell} onChange={ this.handleSetInkwell.bind(this) } />)}
					        </Form.Item>
						 }

						<Form.Item label="Color">
						  {getFieldDecorator('color', {
						  	initialValue: this.widgetProps.color || 'OnBackground', 
						    rules: [
						      {
						        required: true,
						        message: 'Please input the background color',
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
						
						<Form.Item label="Background Color">
						  {getFieldDecorator('backgroundColor', {
						  	initialValue: this.widgetProps.backgroundColor || 'Background', 
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

						<Form.Item label="Border Width">
				          {getFieldDecorator('borderWidth', {
				          	initialValue: this.widgetProps.borderWidth, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the border width',
				              },
				            ],
				          })(<InputNumber min={0} onChange={ value => EventEmitter.dispatch('setBorderWidth', value) } />)}
				        </Form.Item>

				        <Form.Item label="Border Color">
				          {getFieldDecorator('borderColor', {
				          	initialValue: this.widgetProps.borderColor || 'Primary', 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the border color',
				              },
				            ],
				          })(<Select onChange={ value => EventEmitter.dispatch('setBorderColor', value) }>
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

				        <Form.Item label="Border Radius">
				          {getFieldDecorator('borderRadius', {
				          	initialValue: this.widgetProps.borderRadius, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the border radius',
				              },
				            ],
				          })(<InputNumber min={0} onChange={ value => EventEmitter.dispatch('setBorderRadius', value) } />)}
				        </Form.Item>

				        <Form.Item label="Elevation">
				          {getFieldDecorator('elevation', {
				          	initialValue: this.widgetProps.elevation, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the elevation',
				              },
				            ],
				          })(<InputNumber min={0} onChange={ value => EventEmitter.dispatch('setElevation', value) } />)}
				        </Form.Item>

				        <Form.Item label="Opacity">
				          {getFieldDecorator('opacity', {
				          	initialValue: this.widgetProps.opacity || 1, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the opacity',
				              },
				            ],
				          })(<InputNumber min={0} step={0.1} max={1} onChange={ value => EventEmitter.dispatch('setOpacity', value) } />)}
				        </Form.Item>

				        <Form.Item label="Rotation">
    				      {getFieldDecorator('rotation', {
    				      	initialValue: self.widgetProps.rotation || 0, 
    				        rules: [
    				          {
    				            required: true,
    				            message: 'Please input the rotation',
    				          },
    				        ],
    				      })(<InputNumber min={0} step={5} onChange={ value => EventEmitter.dispatch('setRotation', value) } />)}
    				    </Form.Item>

    				    <Form.Item label="Scale">
    				      {getFieldDecorator('scale', {
    				      	initialValue: self.widgetProps.scale || 0, 
    				        rules: [
    				          {
    				            required: true,
    				            message: 'Please input the scale',
    				          },
    				        ],
    				      })(<InputNumber min={0} step={0.1} onChange={ value => EventEmitter.dispatch('setScale', value) } />)}
    				    </Form.Item>
				    </Form>
				</Panel>

				<Panel header="Events" key="2">
					<Form {...this.formItemLayout}>
						<Form.Item label="Event">
				          {getFieldDecorator('event', {
				          	initialValue: this.widgetProps.eventType, 
				            rules: [
				              {
				                required: true,
				                message: 'Please input the event',
				              },
				            ],
				          })(<Select onChange={ this.handleEventChange.bind(this) }>
				          		<Option value="Open Camera">Open Camera</Option>
				          		<Option value="Open Gallery">Open Gallery</Option>
				          		<Option value="Open Popup">Open Popup</Option>
				          		<Option value="Navigate">Navigate</Option>
				          		<Option value="Share">Share</Option>
				          		<Option value="Open Website">Open Website</Option>
				          </Select>)}
				        </Form.Item>

				        {
				        	(function() {
				        		switch(self.state.eventType) {
				        			case "Open Camera": return (
			        				    <Form.Item label="Camera type">
			        				      {getFieldDecorator('cameraType', {
			        				      	initialValue: self.widgetProps.cameraType || 'Picture', 
			        				        rules: [
			        				          {
			        				            required: true,
			        				            message: 'Please input the background camera type',
			        				          },
			        				        ],
			        				      })(<Select onChange={ value => EventEmitter.dispatch('setCameraType', value) }>
			        				      		<Option value="Picture">Picture</Option>
			        				      		<Option value="Video">Video</Option>
			        				      		<Option value="QR">QR</Option>
			        				      		<Option value="Barcode">Barcode</Option>
			        				      </Select>)}
			        				    </Form.Item>
				        			)
				        			case "Navigate": return (
				        				<Form.Item label="Navigate">
			        				      {getFieldDecorator('navigate', {
			        				      	initialValue: self.widgetProps.navigate, 
			        				        rules: [
			        				          {
			        				            required: true,
			        				            message: 'Please input the background navigate',
			        				          },
			        				        ],
			        				      })(<Select onChange={ value => EventEmitter.dispatch('setNavigateToPage', value) }>
			        				      		{ JSON.parse(window.localStorage.pages).map(page => <Option key={page.name} value={page.name}>{ page.name }</Option>) }
			        				      </Select>)}
			        				    </Form.Item>
				        			)
				        			case "Open Popup": return (
				        				<Form.Item label="Popup type">
			        				      {getFieldDecorator('popupType', {
			        				      	initialValue: self.widgetProps.popupType || 'Simple Dialog', 
			        				        rules: [
			        				          {
			        				            required: true,
			        				            message: 'Please input the background popup type',
			        				          },
			        				        ],
			        				      })(<Select onChange={ self.handlePopupTypeChange.bind(self) }>
			        				      		<Option value="Simple Dialog">Simple Dialog</Option>
			        				      		<Option value="Custom Dialog">Custom Dialog</Option>
			        				      		<Option value="Bottom Sheet">Bottom Sheet</Option>
			        				      		<Option value="Scrollable Bottom Sheet">Scrollable Bottom Sheet</Option>
			        				      </Select>)}
			        				    </Form.Item>
				        			)
				        			case "Open Website": return (
				        				<Form.Item label="Website URL">
				        				  {getFieldDecorator('websiteURL', {
				        				  	initialValue: self.widgetProps.websiteURL, 
				        				    rules: [
				        				      {
				        				        required: true,
				        				        message: 'Please input the websiteURL',
				        				      },
				        				    ],
				        				  })(<Input onChange={ event => EventEmitter.dispatch('setWebsiteURL', event.target.value) } />)}
				        				</Form.Item>
				        			)
				        		}
				        	})()
				        }

				        {
				        	this.state.eventType == 'Open Popup' && this.state.popupType == 'Simple Dialog' && (
				        		<React.Fragment>
					        		<Form.Item label="Dialog title">
					        		  {getFieldDecorator('dialogTitle', {
					        		  	initialValue: this.widgetProps.dialogTitle, 
					        		    rules: [
					        		      {
					        		        required: true,
					        		        message: 'Please input the background dialog title',
					        		      },
					        		    ],
					        		  })(<Input onChange={ event => EventEmitter.dispatch('setDialogTitle', event.target.value) } />)}
					        		</Form.Item>

					        		<Form.Item label="Dialog content">
					        		  {getFieldDecorator('dialogContent', {
					        		  	initialValue: this.widgetProps.dialogContent, 
					        		    rules: [
					        		      {
					        		        required: true,
					        		        message: 'Please input the background dialog content',
					        		      },
					        		    ],
					        		  })(<TextArea row={5} style={{height: '150px'}} onChange={ event => EventEmitter.dispatch('setDialogContent', event.target.value) } />)}
					        		</Form.Item>
					        	</React.Fragment>
				        	)
				        }
				    </Form>
				</Panel>
			</Collapse>
		)
	}
}

const CommonSidebar = Form.create({ name: 'register' })(Common);

export default CommonSidebar


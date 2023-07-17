import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'
import IconsDialog from '../IconsDialog'
import Common from './Common'

const MaterialIcons = require('@material-ui/icons')
const { TextArea } = Input;

class AppBar extends Common {
	constructor(props) {
		super(props);

		const currentSelectionProps = JSON.parse(window.localStorage.currentSelection).widgetProps;

		this.state = {
			actions: currentSelectionProps.actions || [],
            leadingIcon: currentSelectionProps.leadingIcon,
            title: currentSelectionProps.title
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
	      tabs: JSON.parse(window.localStorage.currentSelection).widgetProps.tabs,
	    });
    }

    handleAddAction(icon) {
    	let { actions } = this.state;
    	actions.push(icon)
    	this.setState({actions})

    	EventEmitter.dispatch('setActions', actions)
    }

    handleChangeAction(index, icon) {
    	let { actions } = this.state;
    	actions[index] = icon
    	this.setState({actions})

    	EventEmitter.dispatch('setActions', actions)
    }

    handleClearActions() {
    	if(window.confirm('Are you sure you want to clear actions?')) {
    		this.setState({actions: []})
    	}

    	EventEmitter.dispatch('setActions', [])
    }

    handleSetLeadingIcon(icon) {
        this.setState({leadingIcon: icon})
        EventEmitter.dispatch('setLeadingIcon', icon)
    }

    handleClearLeadingIcon() {
        this.setState({leadingIcon: null})
        EventEmitter.dispatch('setLeadingIcon', null)
    }

    render() {
    	// alert('render: ' + JSON.stringify(this.state.actions))
	    const { getFieldDecorator } = this.props.form;

		return(
            <div>
    			<Form {...this.formItemLayout}>
    		        <Form.Item label="Title">
    		          {getFieldDecorator('title', {
    		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.title, 
    		            rules: [
    		              {
    		                required: true,
    		                message: 'Please input the title',
    		              },
    		            ],
    		          })(<Input onChange={ event => EventEmitter.dispatch('setTitle', event.target.value) } />)}
    		        </Form.Item>

                    <Form.Item label="Leading Icon">
                      {getFieldDecorator('leadingIcon')(<div style={{display: 'flex'}}>
                            <IconsDialog>
                                <Button style={{fontSize: '21px'}} geticon={this.handleSetLeadingIcon.bind(this)}>
                                    { this.state.leadingIcon ? React.createElement(MaterialIcons[this.state.leadingIcon]) : '...' }
                                </Button>
                            </IconsDialog>

                            <Button onClick={this.handleClearLeadingIcon.bind(this)}>X</Button>
                        </div>)}
                    </Form.Item>
    		        
    		    	<Form.Item label="Actions">
    		          {getFieldDecorator('actions')(<div style={{display: 'flex'}}>
    		          		{
    		          			this.state.actions.map((icon, i) => {
    		          				return (<IconsDialog key={icon}>
    		          					<Button geticon={this.handleChangeAction.bind(this, i)}>
    		          						{ React.createElement(MaterialIcons[icon]) }
    		          					</Button>
    		          				</IconsDialog>)
    		          			})
    		          		}

    		          		<IconsDialog>
    		          			{ <Button style={{fontSize: '21px'}} geticon={this.handleAddAction.bind(this)}>+</Button> }
    		          		</IconsDialog>

    		          		<Button onClick={this.handleClearActions.bind(this)}>X</Button>
    		          	</div>)}
    		        </Form.Item>

                    <Form.Item label="Drawer List Items">
                      {getFieldDecorator('drawerListItems', {
                        initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.drawerListItems, 
                        rules: [
                          {
                            required: true,
                            message: 'Please input the drawer list items',
                          },
                        ],
                      })(<TextArea style={{height: '150px'}} onChange={ event => EventEmitter.dispatch('setDrawerListItems', event.target.value) } />)}
                    </Form.Item>

                    {/* do this later
                        <Form.Item label="Drawer List Icons">
                      {getFieldDecorator('drawerListItems')(<div style={{display: 'flex'}}>
                            {
                                this.state.drawerListItems.map((icon, i) => {
                                    return (<IconsDialog key={icon}>
                                        <Button geticon={this.handleChangeAction.bind(this, i)}>
                                            { React.createElement(MaterialIcons[icon]) }
                                        </Button>
                                    </IconsDialog>)
                                })
                            }

                            <IconsDialog>
                                { <Button style={{fontSize: '21px'}} geticon={this.handleAddAction.bind(this)}>+</Button> }
                            </IconsDialog>

                            <Button onClick={this.handleClearActions.bind(this)}>X</Button>
                        </div>)}
                    </Form.Item>*/}
    		    </Form>

                { super.render() }
            </div>
		)
	}
}

const AppBarSidebar = Form.create({ name: 'register' })(AppBar);


export default AppBarSidebar;


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

		this.state = {
			icons: this.widgetProps.icons || []
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
	      labels: this.widgetProps.labels,
	      icons: this.widgetProps.icons,
	    });
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

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<div>
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
			          })(<TextArea onChange={ event => EventEmitter.dispatch('setLabels', event.target.value) } />)} {/*this.props.setTitle.bind(this)*/}
			        </Form.Item>

			        <Form.Item label="Icons">
		              {getFieldDecorator('icons')(<div style={{display: 'flex'}}>
		              		{
		              			this.state.icons && this.state.icons.map((icon, i) => {
		              				return (<IconsDialog key={icon + i}>
		              					<Button geticon={this.handleChangeAction.bind(this, i, 'icons')}>
		              						{ icon && React.createElement(MaterialIcons[icon]) }
		              					</Button>
		              				</IconsDialog>)
		              			})
		              		}

		              		<IconsDialog>
		              			{ <Button style={{fontSize: '21px'}} geticon={this.handleAddAction.bind(this, 'icons')}>+</Button> }
		              		</IconsDialog>

		              		<Button onClick={this.handleClearActions.bind(this, 'icons')}>X</Button>
		              	</div>)}
		            </Form.Item>
			    </Form>

			    { super.render() }
			</div>
		)
	}
}

const ListTileSidebar = Form.create({ name: 'register' })(ListTile);

export default ListTileSidebar


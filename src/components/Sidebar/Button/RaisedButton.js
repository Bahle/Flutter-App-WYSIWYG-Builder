import React, { Component } from 'react';
import { Form, Input } from 'antd';
// import { observer, inject } from 'mobx-react'

// @inject('toolDomainStore')
class RaisedButton extends React.Component {
	constructor(props) {
		super(props);
		
		// this.state = {value: JSON.parse(window.localStorage.currentSelection).widgetProps};
	}

	componentDidMount() {
		// this.setState({value: JSON.parse(window.localStorage.currentSelection).widgetProps});
		// this.fuck.value = 'ffdsfd'
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

    handleChange(e) {
    	// console.dir(e.target.value);
    	// this.props.toolDomainStore.setText(e.target.value)
    }

    refreshProps() {
    	// alert(JSON.parse(window.localStorage.currentSelection).widgetProps)
    	// this.setState({value: JSON.parse(window.localStorage.currentSelection).widgetProps})
    	this.props.form.setFieldsValue({
	      text: JSON.parse(window.localStorage.currentSelection).widgetProps,
	    });
    	/* this.fuck.defaultValue = properties.text;
    	this.fuck.initialValue = properties.text; */
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="Text">
		          {getFieldDecorator('text', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps, 
		            rules: [
		              /*{
		                type: 'email',
		                message: 'The input is not valid E-mail!',
		              },*/
		              {
		                required: true,
		                message: 'Please input the button text',
		              },
		            ],
		          })(<Input ref={fuck => this.fuck = fuck} onChange={this.props.setText} />)} {/* this.handleChange.bind(this) */}
		        </Form.Item>
		    </Form>
		)
	}
}

/*const TextActions = {
	setText: function(e) {
		const selected = JSON.parse(window.localStorage.currentSelection).id;
		this.stageRef.setText(e.target.value);
	}
}*/

const RaisedButtonSidebar = Form.create({ name: 'register' })(RaisedButton);

/*class Fuck {
	static hello(e, stageRef) {
		alert('hello world');
		// const selected = JSON.parse(window.localStorage.currentSelection).id;
		// stageRef.setText(e.target.value);
	}
}	

const Obj = {
	func: function() { alert('Got the func'); }
}*/

class RaisedButtonActions {
	static setText(e, stageRef) {
		const selected = JSON.parse(window.localStorage.currentSelection).id;
		stageRef.setText(e.target.value);
	}
}

/*const RaisedButtonActions = {
	setText: function(e, stageRef) {
		const selected = JSON.parse(window.localStorage.currentSelection).id;
		stageRef.setText(e.target.value);
	},
	shit: function() { alert('fuck') }
}*/

export {
	RaisedButtonSidebar, RaisedButtonActions // Fuck, Obj, 
};


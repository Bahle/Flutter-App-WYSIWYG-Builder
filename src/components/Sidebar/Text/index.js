import React, { Component } from 'react';
import { Form, Input } from 'antd';
// import { observer, inject } from 'mobx-react'

// @inject('toolDomainStore')
class Text extends React.Component {
	constructor(props) {
		super(props);
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

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="Text">
		          {getFieldDecorator('text', {
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
		          })(<Input onChange={this.props.setText} />)} {/* this.handleChange.bind(this) */}
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

 const TextForm = Form.create({ name: 'register' })(Text);

class Fuck {
	static hello() {
		alert('hello world');
	}
}	

const Obj = {
	func: function() { alert('Got the func'); }
}

const TextActions = {
	setText: function(e, stageRef) {
		const selected = JSON.parse(window.localStorage.currentSelection).id;
		stageRef.setText(e.target.value);
	}//,
	// shit: function() { alert('fuck') }
}

export {
	TextForm, Fuck, Obj, TextActions
};


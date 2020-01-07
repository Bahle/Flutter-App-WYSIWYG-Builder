import React, { Component } from 'react';
import { Form, InputNumber } from 'antd';
// import { observer, inject } from 'mobx-react'

// @inject('toolDomainStore')
class Page extends React.Component {
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

    refreshProps() {
    	this.props.form.setFieldsValue({
	      height: JSON.parse(window.localStorage.currentPage).height,
	    });
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="height">
		          {getFieldDecorator('height', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).height || 640, 
		            rules: [
		              /*{
		                type: 'email',
		                message: 'The input is not valid E-mail!',
		              },*/
		              {
		                required: true,
		                message: 'Please input the page height',
		              },
		            ],
		          })(<InputNumber step={10} ref={fuck => this.fuck = fuck} onChange={this.props.setHeight} />)}
		        </Form.Item>
		    </Form>
		)
	}
}

const PageSidebar = Form.create({ name: 'register' })(Page);

class PageActions {
	static setHeight(value, shapeRef) {
		// alert(JSON.stringify(e))
		// const selected = JSON.parse(window.localStorage.currentSelection).id;

		shapeRef.setHeight(value);
		// alert('Setting height');
		console.dir(shapeRef);
		// shapeRef.
	}
}

export {
	PageSidebar, PageActions
};


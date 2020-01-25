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
	      height: JSON.parse(window.localStorage.pages).find(page => page.name == window.localStorage.currentPage).height || 640, // later remove the || 640
	    });
    }

    render() {
	    const { getFieldDecorator } = this.props.form;
	    const page = JSON.parse(window.localStorage.pages).find(page => page.name == window.localStorage.currentPage);

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="height">
		          {getFieldDecorator('height', {
		          	initialValue: (page && page.height) || 640, 
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
		shapeRef.setHeight(value);
		
		let temp = JSON.parse(window.localStorage.pages)
		temp.find(page => page.name == window.localStorage.currentPage).height = value;
		window.localStorage.pages = JSON.stringify(temp);
	}
}

export {
	PageSidebar, PageActions
};


import React, { Component } from 'react';
import { Form, Switch } from 'antd';
import { EventEmitter } from '../../utils/Events.js'
import Common from './Common'

class DatePicker extends Common {
	constructor(props) {
		super(props);

		this.widgetProps = JSON.parse(window.localStorage.currentSelection).widgetProps
		
		this.state = {
			isYear: this.widgetProps.isYear,
			isMonth: this.widgetProps.isMonth
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
    	const { isYear, isMonth } = this.state;

    	this.props.form.setFieldsValue({
	      isYear,
	      isMonth
	    });
    }

    handleIsYear(value) {
    	this.setState({isYear: value})
    	EventEmitter.dispatch('setIsYear', value)
    }

    handleIsMonth(value) {
    	this.setState({isMonth: value})
    	EventEmitter.dispatch('setIsMonth', value)
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<React.Fragment>
				<Form {...this.formItemLayout}>
			        <Form.Item label="Is Year">
			          {getFieldDecorator('isYear')
			          	(<Switch checked={this.state.isYear} onChange={ this.handleIsYear.bind(this) } />)}
			        </Form.Item>

			        <Form.Item label="Is Month">
			          {getFieldDecorator('isMonth')
			          	(<Switch checked={this.state.isMonth} onChange={ this.handleIsMonth.bind(this) } />)}
			        </Form.Item>
			    </Form>

		        { super.render() }
		    </React.Fragment>
		)
	}
}

const DatePickerSidebar = Form.create({ name: 'register' })(DatePicker);

export default DatePickerSidebar;


import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import ImageDialog from './ImageDialog'
import { initializeAction } from '../../utils.js'

const { Option } = Select;

class Image extends React.Component {
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

    refreshProps() {
    	const { source, stretchMode } = JSON.parse(window.localStorage.currentSelection).widgetProps;

    	this.props.form.setFieldsValue({
	      source,
	      stretchMode,
	    });
    }

    componentDidMount() {
    	this.source.input.setAttribute('readonly', 'readonly')
    }

    getImage(value) {
    	// alert('getImage: ' + value)
    	// console.dir(this.source)
    	this.source.input.value = value;

    	this.props.setImage(value)
    }

    handleSelectStretchMode(value) {
    	alert(value)

    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <ImageDialog>
			        <Form.Item getImage={this.getImage.bind(this)} label="Source" style={{cursor: 'pointer'}}>
			          {getFieldDecorator('source', {
			          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.image, 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the source',
			              },
			            ],
			          })(<Input addonBefore="Choose file" placeholder='Click to select file' ref={input => this.source = input} />)}
			        </Form.Item>
		        </ImageDialog>

		        <Form.Item label="Stretch mode" style={{cursor: 'pointer'}}>
		        	{getFieldDecorator('stretchMode', {
		          	initialValue: JSON.parse(window.localStorage.currentSelection).widgetProps.stretchMode || 'Stretch', 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the stretch mode',
		              },
		            ],
		          })(<Select defaultValue="Stretch" onChange={this.props.setStretchMode}>
				      <Option value="Stretch">Stretch</Option>
				      <Option value="Cover">Cover</Option>
				      <Option value="Contain">Contain</Option>
				    </Select>)}
		        </Form.Item>
		    </Form>
		)
	}
}

const ImageSidebar = Form.create({ name: 'register' })(Image);

class ImageActions {
	static initialize() {
		this.actions = initializeAction(['setImage', 'setStretchMode'], this);
	}
}

export {
	ImageSidebar, ImageActions 
};


import React, { Component } from 'react';
import { Form, Input, Select, Switch } from 'antd';
import ImageDialog from './ImageDialog'
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'
import Common from './Common'

const { Option } = Select;

class Image extends Common {
	constructor(props) {
		super(props);

		this.widgetProps = JSON.parse(window.localStorage.currentSelection).widgetProps;

		this.state = {
			isCachedNetworkImage: this.widgetProps.isCachedNetworkImage
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
    	const { source, stretchMode, isCachedNetworkImage } = this.widgetProps;

    	this.props.form.setFieldsValue({
	      source,
	      stretchMode,
	      isCachedNetworkImage
	    });
    }

    componentDidMount() {
    	this.source.input.setAttribute('readonly', 'readonly')
    }

    getImage(value) {
    	// alert('getImage: ' + value)
    	// console.dir(this.source)
    	this.source.input.value = value;

    	// this.props.setImage(value) ?
    	EventEmitter.dispatch('setImage', value)
    }

    handleCachedImage(value) {
    	EventEmitter.dispatch('setIsCachedNetworkImage', value)

    	this.setState({isCachedNetworkImage: value})
    }

    render() {
	    const { getFieldDecorator } = this.props.form;

		return(
			<React.Fragment>
				<Form {...this.formItemLayout}>
			        <ImageDialog>
				        <Form.Item getImage={this.getImage.bind(this)} label="Source" style={{cursor: 'pointer'}}>
				          {getFieldDecorator('source', {
				          	initialValue: this.widgetProps.image, 
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
			          	initialValue: this.widgetProps.stretchMode || 'Stretch', 
			            rules: [
			              {
			                required: true,
			                message: 'Please input the stretch mode',
			              },
			            ],
			          })(<Select defaultValue="Stretch" onChange={ value => EventEmitter.dispatch('setStretchMode', value) }>
					      <Option value="Stretch">Stretch</Option>
					      <Option value="Cover">Cover</Option>
					      <Option value="Contain">Contain</Option>
					    </Select>)}
			        </Form.Item>

			        <Form.Item label="Cached Network Image" style={{cursor: 'pointer'}}>
			        	{getFieldDecorator('isCachedNetworkImage')
			        		(<Switch checked={this.state.isCachedNetworkImage} onChange={ this.handleCachedImage.bind(this) } /> )}
			        </Form.Item>
			    </Form>

			    { super.render() }
		    </React.Fragment>
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


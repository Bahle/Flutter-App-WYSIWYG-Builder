import React, { Component } from 'react';
import { Form, InputNumber, Input, Select, Switch } from 'antd';
import ImageDialog from './ImageDialog'
import { EventEmitter } from '../../utils/Events.js'

const { Option } = Select;

class Page extends React.Component {
	constructor(props) {
		super(props);

		this.currentPage = JSON.parse(window.localStorage.pages).find(page => page.name == window.localStorage.currentPage)

        this.state = {
            hasSearch: this.currentPage.hasSearch
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
	      height: this.currentPage.height || 640, // later remove the || 640
	    });
    }

    getBackgroundImage(value) {
    	this.source.input.value = value;

    	EventEmitter.dispatch('setBackgroundImage', value)
    }

    toggleSearch(checked) {
        this.setState({hasSearch: checked})

        let pages = JSON.parse(localStorage.pages);
        
        // update localStorage pages array with new current page props
        this.currentPage.hasSearch = checked
        
        pages = pages.map(page => {
            return page.id == this.currentPage.id ? this.currentPage : page 
        })
        localStorage.pages = JSON.stringify(pages)
        
        EventEmitter.dispatch('setPageHasSearch', checked)
    }

    render() {
	    const { getFieldDecorator } = this.props.form;
	    const page = this.currentPage;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="height">
		          {getFieldDecorator('height', {
		          	initialValue: (page && page.height) || 640, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the page height',
		              },
		            ],
		          })(<InputNumber step={10} onChange={value => EventEmitter.dispatch('setPageHeight', value) } />)}
		        </Form.Item>

                <Form.Item label="Outer height">
                  {getFieldDecorator('outerHeight', {
                    initialValue: page?.outerHeight ?? 640, 
                    rules: [
                      {
                        required: true,
                        message: 'Please input the outer page height',
                      },
                    ],
                  })(<InputNumber step={10} onChange={value => EventEmitter.dispatch('setOuterPageHeight', value) } />)}
                </Form.Item>

    		    <Form.Item label="Background color">
    	          {getFieldDecorator('backgroundColor', {
    	          	initialValue: this.currentPage?.backgroundColor || 'Background', 
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

                <ImageDialog>
        	        <Form.Item getImage={this.getBackgroundImage.bind(this)} label="Source" style={{cursor: 'pointer'}}>
        	          {getFieldDecorator('source', {
        	          	initialValue: this.currentPage?.backgroundImage, 
        	            rules: [
        	              {
        	                required: true,
        	                message: 'Please input the source',
        	              },
        	            ],
        	          })(<Input addonBefore="Choose file" placeholder='Click to select file' ref={input => this.source = input} />)}
        	        </Form.Item>
                </ImageDialog>

                <Form.Item label="Has search">
                  {getFieldDecorator('hasSearch')
                    (<Switch checked={this.state.hasSearch} onChange={ this.toggleSearch.bind(this) } />)}
                </Form.Item>
		    </Form>
		)
	}
}

const PageSidebar = Form.create({ name: 'register' })(Page);

export default PageSidebar;


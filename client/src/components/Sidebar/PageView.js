import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { initializeAction } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'
const { TextArea } = Input;

class PageView extends React.Component {
	constructor(props) {
		super(props);

		/*console.clear();
		console.log(window.localStorage.currentSelection);*/
		const currentSelectionProps = JSON.parse(window.localStorage.currentSelection).widgetProps;

		this.tabs = currentSelectionProps.tabs || [];
		
		let tabCount = this.tabs.length;
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

    setTabs(event) {
    	let value = event.target.value,
    		tabs = value.split('\n'),
    		tabComponentId = JSON.parse(window.localStorage.currentSelection).id,
    		pages = JSON.parse(window.localStorage.pages),
    		tabPages = pages.filter(page => page.belongsTo == tabComponentId),
    		otherPages = pages.filter(page => page.belongsTo != tabComponentId);

    	if(this.tabCount > tabs.length) { // when a new row i.e. tab has been added
    		const tabName = `stage_${tabComponentId}_tab${tabs.length}`; // <- (start here) define unique name here to make identifying while filtering easier
    		tabPages.push({ type: 'TabView', belongsTo: tabComponentId, title: tabs[tabs.length - 1], name: tabName, id: tabName, key: tabName });
    	} else if(this.tabCount < tabs.length) { // when a row i.e. tab has been removed
    		tabPages.pop();
    	}

    	this.tabCount = tabs.length;

    	// EventEmitter.dispatch('setTabs', event.target.value)

        // initialize with 3 tabs by default
        /*for(var a in [1,2,3]) {
          const tabName = `stage_${this.props.id}_tab${parseInt(a) + 1}`; // <- (start here) define unique name here to make identifying while filtering easier
          pages.push({ type: 'TabView', belongsTo: this.props.id, name: tabName, id: tabName, key: tabName })
        }*/
        
        pages = otherPages.concat(tabPages)

        window.localStorage.pages = JSON.stringify(pages);
        EventEmitter.dispatch('setTabs', value)
    }

    render() {
    	const { getFieldDecorator } = this.props.form;

		return(
			<Form {...this.formItemLayout}>
		        <Form.Item label="Tabs">
		          {getFieldDecorator('tabs', {
		          	initialValue: this.tabs, //JSON.parse(window.localStorage.currentSelection).widgetProps.tabs, 
		            rules: [
		              {
		                required: true,
		                message: 'Please input the tabs',
		              },
		            ],
		          })(<TextArea row={5} style={{height: '150px'}} onChange={ this.setTabs.bind(this) } />)}
		        </Form.Item>
		    </Form>
		)
	}
}

const PageViewSidebar = Form.create({ name: 'register' })(PageView);

/*class TextActions {
	static initialize() {
		this.actions = initializeAction(['setText'], this);
	}
}*/

export default PageViewSidebar;


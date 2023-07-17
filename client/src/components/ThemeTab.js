import React from 'react'
import { Tabs, InputNumber, Table, Select, Button } from 'antd';
import ColorPicker from 'rc-color-picker';
import ColorPickerDialog from './ColorPickerDialog'
import 'rc-color-picker/assets/index.css';
import './theme-tab-color-picker.css'

const { TabPane } = Tabs;
const { Option } = Select;

/*var defaultValues = {
	'color': {
		Primary: '#fff',
		PrimaryVariant: '#fff',
		Secondary: '#fff',
		SecondaryVariant: '#fff',
		Background: '#fff',
		Surface: '#fff',
		Error: '#fff',
		OnPrimary: '#fff',
		OnSecondary: '#fff',
		OnBackground: '#fff',
		OnSurface: '#fff',
		OnError: '#fff'
	},
	fontSize: 
}*/

/*primary, primaryVariant, secondary, secondaryVariant, Background, Surface, Error, 
onPrimary, onSecondary, onBackground, onSurface, onError, brightness*/
const colourDataSource = [
  { key: 'Primary', name: 'Primary', materialColor: 'blue500', colorCode: '#2196f3' },
  { key: 'PrimaryVariant', name: 'Primary Variant', materialColor: 'white', colorCode: '#ffffff' },
  { key: 'Secondary', name: 'Secondary', materialColor: 'pinkA400', colorCode: '#f50057' },
  { key: 'SecondaryVariant', name: 'Secondary Variant', materialColor: 'white', colorCode: '#ffffff' },
  { key: 'Background', name: 'Background', materialColor: 'white', colorCode: '#ffffff' },
  { key: 'Button', name: 'Button', materialColor: 'grey300', colorCode: '#e0e0e0' },
  { key: 'Surface', name: 'Surface', materialColor: 'white', colorCode: '#ffffff' },
  { key: 'Error', name: 'Error', materialColor: 'red700', colorCode: '#d32f2f' },
  { key: 'OnPrimary', name: 'On Primary', materialColor: 'white', colorCode: '#ffffff' },
  { key: 'OnSecondary', name: 'On Secondary', materialColor: 'black', colorCode: '#000000' },
  { key: 'OnBackground', name: 'On Background', materialColor: 'black', colorCode: '#000000' },
  { key: 'OnSurface', name: 'On Surface', materialColor: 'black', colorCode: '#000000' },
  { key: 'OnError', name: 'On Error', materialColor: 'white', colorCode: '#ffffff' },
];

if(!window.localStorage.themeData) window.localStorage.themeData = "{\"color\":" + JSON.stringify(colourDataSource) + ",\"typography\":{},\"icons\":\"\"}";

/*const colourColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Colour',
    dataIndex: 'materialColor',
    key: 'materialColor',
    //render: (text, record) => <ColorPicker color={'#FFF'} onChange={ ({color, alpha}) => onPickColour(record, color, alpha) } placement="topLeft" />
  }
];*/

/*const colourDataSource = {
  Primary: { colour: 'red900', colorCode: '#f90' },
  { key: 'PrimaryVariant', name: 'Primary Variant', colour: 42, fontFamily: 'Roboto' },
  { key: 'Secondary', name: 'Secondary', colour: 32, fontFamily: 'Roboto' },
  { key: 'SecondaryVariant', name: 'Secondary Variant', colour: 32, fontFamily: 'Roboto' },
  { key: 'Background', name: 'Background', colour: 32, fontFamily: 'Roboto' },
  { key: 'Surface', name: 'Surface', colour: 32, fontFamily: 'Roboto' },
  { key: 'Error', name: 'Error', colour: 32, fontFamily: 'Roboto' },
  { key: 'OnPrimary', name: 'On Primary', colour: 32, fontFamily: 'Roboto' },
  { key: 'OnSecondary', name: 'On Secondary', colour: 32, fontFamily: 'Roboto' },
  { key: 'OnBackground', name: 'On Background', colour: 32, fontFamily: 'Roboto' },
  { key: 'OnSurface', name: 'On Surface', colour: 32, fontFamily: 'Roboto' },
  { key: 'OnError', name: 'On Error', colour: 32, fontFamily: 'Roboto' }
;*/

String.prototype.twoDigits = function() {
	return this.length == 2 ? this : '0' + this;
};

const onPickColour = (record, color, alpha) => {
	alert('what is ' + JSON.stringify(record))
	console.log('color: ', color)
	console.log('alpha ', alpha)

	console.log('alpha to hex: ', Math.round(alpha/100*255).toString(16).twoDigits())

	const themeData = JSON.parse(window.localStorage.themeData);
	themeData['color'][record.name] = [{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'Size',
		dataIndex: 'size',
		key: 'size',
		render: text => <InputNumber defaultValue={text} style={{width: '90%'}} />
	}]
}

function ThemeTab() {
	const panes = ['Colour', 'Typography', 'Icons', 'Corners']
	const [activeKey, setActiveKey] = React.useState('Colour')

	// EventEmitter.subscribe('pickColor', pickColor)

	const onTabChange = (activeKey) => {
		setActiveKey(activeKey)
	}

	const saveModels = () => {
		
	}

	const pickColor = ({materialColor, colorCode}) => {
		// var color = materialColor.match(/[a-z]+/g)[0]
		// var shade = colorString.match(/[a-z]+/g)

	}

	const colourColumns = [
	  {
	    title: 'Name',
	    dataIndex: 'name',
	    key: 'name',
	  },
	  {
	    title: 'Colour',
	    dataIndex: 'materialColour',
	    key: 'materialColour',
	    render: (text, record) => <ColorPickerDialog name={record.key} />
	  }
	];

	return (
		<div>
			<div style={{position:'absolute',zIndex: 1,top: '4px',right: '7px'}}>
			  {
		          <Button style={{width: 105}} onClick={saveModels} type="primary">SAVE</Button>
			  }
			</div>
			<Tabs
	          hideAdd
	          onChange={onTabChange}
	          activeKey={activeKey}
	          type="editable-card"
	          onEdit={() => {}}
	        >
	          { 
	            panes.map(pane => (
	            <TabPane tab={pane} key={pane} style={{padding: '0 20px'}}>
	              { (() => {
	              	if(pane == 'Colour')
	              		return <Table dataSource={colourDataSource} columns={colourColumns} pagination={false} />
	              	else if(pane == 'Typography')
	              		return <Table dataSource={[]} columns={[]} pagination={false} /> // typographyDataSource typographyColumns
	              	else if(pane == 'Icons')
	              		return (<div style={{display: 'flex'}}>Type:
	              			<Select style={{width: 150}}>
	              				<Option value="Filled">Filled</Option>
	              				<Option value="Sharp">Sharp</Option>
	              				<Option value="Rounded">Rounded</Option>
	              				<Option value="Outlined">Outlined</Option>
	              				<Option value="TwoTone">TwoTone</Option>
	              			</Select>
	              		</div>)
	              	else if(pane == 'Corners')
	              		return <div>TBD</div>
	              })() }
	            </TabPane>
	          ))
	        }
	        </Tabs>
	    </div>
	)
}

export default ThemeTab;
import * as React from 'react';
import { render } from 'react-dom';
import ResizeDemo from '../../ResizeDemo';
import { Widget } from '../../enums';
import { setGlobalShapesByStage, loadGlobalShapes } from '../../GlobalState';
import {observable} from "mobx"
import {observer} from "mobx-react"

const uuidv1 = require('uuid/v1');

let { useState, createRef } = React;

// window.localStorage.removeItem('currentSelection');

let $ = window.$;

let stageShapes = [];

/*function setGlobalShapes(stageId, shapes) {
	window.localStorage.setItem('currentSelection', JSON.stringify({ stageId, shapes}));
}*/

// const Stage = ({id}) => {
// @observer
class Stage extends React.Component {
	// let ids = [uuidv1()];

	// let selectedGuy = null;
	
	/*let thatGuy = window.localStorage.currentSelection !== undefined ? JSON.parse(window.localStorage.currentSelection) : {};
	const [shapes, setShapes] = useState([{width: thatGuy.width || 300, height: thatGuy.height || 200, x: thatGuy.x || 0, y: thatGuy.y || 0, key: ids[0], id: ids[0], type: Widget.RaisedButton, stageId: id}] );*/

	/// const [shapes, setShapes]	  = useState(loadGlobalShapes(id, 'start') || []);
	/// const [selected, setSelected] = useState(null);
	
	constructor(props) {
		super(props)

		/*alert(this.props.id)
		alert(JSON.parse(window.localStorage.pages).find(page => page.name == this.props.id).height);*/

		this.state = {
			shapes: loadGlobalShapes(this.props.id, 'start') || [],
			good: null,
			height: JSON.parse(window.localStorage.pages).find(page => page.name == this.props.id).height
		};

		this.sam = {};
	}

	/*state = {
		shapes: loadGlobalShapes(this.props.id, 'start') || []
	};*/

	/*componentDidMount() {
		this.setState({
			shapes: loadGlobalShapes(this.props.id, 'start'),
		})

		this.init = true
	}*/

	init = false;

	/*shouldComponentUpdate(nextProps, nextState) {
		alert('this.state: ' + JSON.stringify(this.state));
		alert('nextState: ' + JSON.stringify(nextState));
		console.log('state same? ' + nextState == this.state)
		if(nextState == this.state) return false;
		console.dir(nextState);
		console.dir(nextState);

		return true;
		// return this.init;
		return this.state != nextState;

	}*/
	hello(text) {
		const componentId = JSON.parse(window.localStorage.currentSelection).id;

		/*alert('hello, world')
		let newShapes = this.state.shapes.map(shape => {
			console.log('--- look here ---');
			console.dir(shape);
			if(componentId == shape.id) {
				alert('matched: ' + componentId)
				alert(JSON.stringify(shape.props))
				// alert(JSON.stringify(this.refs))
				shape.widgetProps = text;
				this.refs.find(ref => ref.id == sha)

				// if(shape.widgetProps === undefined) shape.widgetProps = {};
				// this.refs[shape.id].doIt(text);
			}
			
			return shape;
		});

		// alert('newShapes is: ' + JSON.stringify(newShapes));
		this.setState({shapes: newShapes});
		setGlobalShapesByStage(this.props.id, newShapes);*/

		// console.dir(this.sam);
		this.sam[componentId].helloWorld();
	}

	setText(text) {
		const componentId = JSON.parse(window.localStorage.currentSelection).id;
		this.sam[componentId] && this.sam[componentId].setText(text);	
	}

	setHeight(value) {
		this.setState({height: value + 'px'})
	}

	handleOnKeyDown = (e) => {
		e.preventDefault();

		if(e.ctrlKey) {
			if(e.keyCode == 68) { // 'd' key
				let currentSelection = window.localStorage.getItem('currentSelection');
				if(!currentSelection) {
					alert('Please select an item to duplicate');
					return;
				}

				let fuck = loadGlobalShapes(this.props.id);
				
				currentSelection = JSON.parse(currentSelection);

				let shapeId = 'a' + uuidv1();
				// console.log(`new id: ${shapeId}`);
				/*ids.push(id);
				console.log(ids);*/
				let newShapes = [...fuck, {x:0, y:0, width:currentSelection.width, height:currentSelection.height, key:shapeId, id: shapeId, type: currentSelection.type, stageId: this.props.id}];
				// setShapes(newShapes); // later also type property
				this.setState({shapes: newShapes})
				setGlobalShapesByStage(this.props.id, newShapes);
			}
		}

		if(e.keyCode == 46) { // 'delete' key
			let currentSelection = window.localStorage.getItem('currentSelection');
			if(!currentSelection) {
				alert('Please select an item to delete');
				return;
			}

			let shit = loadGlobalShapes(this.props.id);
			// use the index of the ids array to get and remove the shape at relevant index
			// by duplicating the shapes array and splicing it at relevant index, then set the state object with the new array 
			let shapeId = JSON.parse(currentSelection).id;
			// alert('what is key: ' + id);
			/*let elemIndex = ids.indexOf(id);
			// alert('what is ids: ' + ids);
			// alert('elemIndex: ' + elemIndex);
			ids.splice(elemIndex, 1);
			let dupli = Object.assign([], shapes);
			dupli.splice(elemIndex, 1);*/
			
			// console.log(JSON.stringify(shapes) + ' vs. ' + JSON.stringify(fuck));
			// console.dir(shit.map(shape => shape.id))
			var fuck = shit.filter(shape => shape.id != shapeId);
			// console.dir(fuck.map(shape => shape.id))
			// setShapes(fuck);
			this.setState({shapes: fuck})
			setGlobalShapesByStage(this.props.id, fuck);
		}
	}

	good = null
	// console.log('the stage id is ' + id);
	// refs = 'sdfsdfsdf'
	/*sam0 = null; //React.createRef();
	sam1 = React.createRef();
	sam2 = React.createRef();
	sam3 = React.createRef();
	sam4 = React.createRef();
	sam5 = React.createRef();
	sam6 = React.createRef();
	sam7 = React.createRef();
	sam8 = React.createRef();
	sam9 = React.createRef();
	sam10 = React.createRef();
	fuckRef = React.createRef();*/

	render() {
		// const good = this.state !== null && this.state.shapes.map(shapeProps => <ResizeDemo {...shapeProps} />);
		// this.setState({good});

		return (
			<div onKeyDown={this.handleOnKeyDown} id={this.props.id} style={{width: '360px', height: this.state.height, border: 'solid 2px black'}} onMouseDown={e => {
				const currentTool = window.localStorage.getItem('currentTool');
				if( currentTool === null || currentTool === undefined ) return;
				//! took me some time to figure out
				// in ResizeDemo when store updated props in localStorage the one here are not updated
				// hence update the props from localStorage
				let fuck = loadGlobalShapes(this.props.id);
				// setShapes(fuck || []);

				let target = e.target;
				if( $(target).hasClass('react-contextmenu-item') ) return;
				
				let uuid = 'a' + uuidv1();
				
				// alert($(this).offset())
				/*console.clear();
				console.log('click target')
				console.dir(e.target)*/
				const offset = $(`#${this.props.id}`).offset(); // `#${id}`
				if(!offset) return; //? eish
				
				if($(target).parents('.widget').length == 0 && !$(target).is('.widget')) {
					let newShapes = [...fuck, {width:50, height:50, x: e.pageX - offset.left, y: e.pageY - offset.top, key: uuid, id: uuid, type: Widget.Text, stageId: this.props.id}]; // currentTool == 'text' ? Widget.Text : Widget.Empty
					// setShapes(newShapes); // later also type property
					this.setState({shapes: newShapes})
					setGlobalShapesByStage(this.props.id, newShapes);
				}
			}}>
				{ this.state.shapes.map(shapeProps => <ResizeDemo ref={shape => this.sam[shapeProps.id] = shape} {...shapeProps} />) }
			</div>
		)
	}
}

export default Stage;
// render(<Stage />, document.getElementById('root'));
import * as React from 'react';
import { render } from 'react-dom';
import ResizeDemo from '../../ResizeDemo';
import { Widget } from '../../enums';
import { setGlobalShapesByStage, loadGlobalShapes } from '../../GlobalState';
import { observable } from "mobx"
import { observer } from "mobx-react"
import { actions } from '../../utils.js'

const uuidv1 = require('uuid/v1');

let { useState, createRef } = React;

let $ = window.$;

let stageShapes = [];

class Stage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			shapes: loadGlobalShapes(this.props.id, 'start') || [],
			good: null,
			height: JSON.parse(window.localStorage.pages).find(page => page.name == this.props.id).height
		};

		this.sam = {};

		actions.forEach(action => {
			this[action] = value => {
				const componentId = JSON.parse(window.localStorage.currentSelection).id;
				this.sam[componentId] && this.sam[componentId][action](value);
			}
		})
	}

	hello(text) {
		const componentId = JSON.parse(window.localStorage.currentSelection).id;

		this.sam[componentId].helloWorld();
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
		return (
			<div onKeyDown={this.handleOnKeyDown} id={this.props.id} style={{width: '360px', height: this.state.height, border: 'solid 2px black'}} onMouseDown={e => {
				const currentTool = JSON.parse(window.localStorage.getItem('currentTool'));
				if(!currentTool) return;
				//! took me some time to figure out
				// in ResizeDemo when store updated props in localStorage the one here are not updated
				// hence update the props from localStorage
				let fuck = loadGlobalShapes(this.props.id);
				// setShapes(fuck || []);

				let target = e.target;
				if( $(target).hasClass('react-contextmenu-item') ) return;
				
				let uuid = 'a' + uuidv1();
				
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
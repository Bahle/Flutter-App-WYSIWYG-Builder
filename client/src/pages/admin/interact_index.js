import * as React from 'react';
import { render } from 'react-dom';
import ResizeDemo from '../../ResizeDemo';
import { Widget } from '../../enums';
import { setGlobalShapesByStage, loadGlobalShapes } from '../../GlobalState';
import { actions } from '../../utils.js'
import { EventEmitter } from '../../utils/Events.js'

const uuidv1 = require('uuid/v1');

let { useState, createRef } = React;

let $ = window.$;

let stageShapes = [];

class Stage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			shapes: loadGlobalShapes(this.props.id, 'start') || [],
			height: this.getPageHeight()
		};

		this.sam = {};

		actions.forEach(action => {
			this[action] = value => {
				const componentId = JSON.parse(window.localStorage.currentSelection).id;
				console.log('componentId: ' + componentId)
				console.log('this.sam[componentId]: ' + this.sam[componentId])
				console.dir('this.sam is', this.sam)

				this.sam[componentId] && this.sam[componentId][action](value);
			}
		})

		 // when make repeatable has been called on a container receive event and update the stage to reflect removed shapes
		EventEmitter.subscribe('makeRepeatable', this.updateStage.bind(this));
		EventEmitter.subscribe('setPageHeight', this.setPageHeight.bind(this));
		EventEmitter.subscribe('addRepeatObjects', this.addRepeatObjects.bind(this));
		EventEmitter.subscribe('removeRepeatObjects', this.removeRepeatObjects.bind(this));
		EventEmitter.subscribe('addToBoundingContainer', this.addToBoundingContainer.bind(this));
		EventEmitter.subscribe('sendToBack', this.sendToBack.bind(this));
	}

	addRepeatObjects({stageId, extraObjects}) {
		if(this.props.id != stageId) return;
		// console.dir('addRepeatObjects', extraObjects)
		// alert('addRepeatObjects: ' + JSON.stringify(extraObjects))

		// if(!extraObjects.children) {
			this.setState({ shapes: [...this.state.shapes, ...extraObjects] })
		// } else {
			// this.setState({ shapes: [...this.state.shapes, extraObjects] }) // only one fucking container
		// }
	}

	removeRepeatObjects() {
		const shapes = this.state.shapes.filter(shape => !shape.isRepeatObject);

		this.setState({ shapes })
	}

	addToBoundingContainer({thisObject:from, widget:to}) {
		// alert('from: ' + JSON.stringify(from))
		// alert('to: ' + JSON.stringify(to))
		// console.dir('FUcking objects; from: ', from, 'to: ', to)

		if(this.props.id == from.grandParentStage) {
			// alert('this.props.id == from.stageId')

			// remove object from original stage
			const shapes = this.state.shapes.filter(shape => shape.id != from.id)

			let result = {};
			shapes.forEach(shape => {
				result[shape.id] = shape;
			})

			window.localStorage['stage_' + from.grandParentStage] = JSON.stringify(result) // shape
			this.setState({ shapes })
		} else if(this.props.id == to.id) {
			// alert('this.props.id == to.id')
			// add the object to the target stage
			// alert('to.id: ' + to.id)
			const shapes = JSON.parse(window.localStorage['stage_' + to.id])
			shapes[from.id] = from; // start to check from here

			window.localStorage['stage_' + to.id] = JSON.stringify(shapes)
			this.setState({ shapes: Object.values(shapes) })
		}
	}

	updateStage({stageId: grandParentStage, id: parentStage}) {
		// alert('grandParentStage: ' + JSON.stringify(grandParentStage))
		// alert('parentStage: ' + JSON.stringify(parentStage))
		if(this.props.id == grandParentStage) {
			this.setState({shapes: loadGlobalShapes(this.props.id)});
		} else if(this.props.id == parentStage) {
			this.setState({shapes: loadGlobalShapes(this.props.id)});
		}
	}

	sendToBack({id, stageId}) {
		if(this.props.id == stageId) {
			const { shapes } = this.state;
			shapes.unshift( shapes.splice( shapes.findIndex(shape => shape.id == id), 1 )[0] ) // move the single found item to the front
			
			this.setState({ shapes });
			setGlobalShapesByStage(this.props.id, shapes);
		}
	}

	getPageHeight() {
		const page = JSON.parse(window.localStorage.pages).find(page => page.name == this.props.id);
		return page && page.height ? page.height : '100%';
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
				let newShapes = [...fuck, {x:currentSelection.x + 20, y:currentSelection.y + 20, width:currentSelection.width, height:currentSelection.height, key:shapeId, id: shapeId, type: currentSelection.type, stageId: this.props.id}];
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
			currentSelection = JSON.parse(currentSelection)

			if(currentSelection.type == 'TabBar') {
				if(window.confirm('Are you sure you want to delete this tab bar along with all its children?')) {
					let pages = JSON.parse(window.localStorage.pages);
					pages = pages.filter(page => page.belongsTo != currentSelection.id);

					window.localStorage.pages = JSON.stringify(pages)
				}
			}

			let shit = loadGlobalShapes(this.props.id);
			let shapeId = currentSelection.id;
			var fuck = shit.filter(shape => shape.id != shapeId);
			
			this.setState({shapes: fuck})
			setGlobalShapesByStage(this.props.id, fuck);
		}
	}

	setPageHeight(value) {
		this.setState({height: value});

		let temp = JSON.parse(window.localStorage.pages)
		temp.find(page => page.name == window.localStorage.currentPage).height = value;
		window.localStorage.pages = JSON.stringify(temp);
	}
	
	render() {
		return (
			<div onKeyDown={this.handleOnKeyDown} id={this.props.id} style={{width: '100%'/*'360px'*/, height: this.state.height, /*border: 'solid 2px black'*/}} onMouseDown={e => {
				if(e.button == 2) return;

				const currentTool = window.localStorage.getItem('currentTool')
				if(currentTool == "null") return;
				//! took me some time to figure out
				// in ResizeDemo when store updated props in localStorage the one here are not updated
				// hence update the props from localStorage
				let fuck = loadGlobalShapes(this.props.id);
				
				let target = e.target;
				if( $(target).hasClass('react-contextmenu-item') ) return;
				
				let uuid = 'a' + uuidv1();
				
				const offset = $(`#${this.props.id}`).offset();
				if(!offset) return; //? eish
				
				if( ($(target).parents('.widget').length == 0 || $(target).parents('.widget-container').length == 1) && !$(target).is('.widget') ) {
					e.preventDefault()
					e.stopPropagation()
					
					// - diff/2 <- it just works, I don't know why?!
					let newShapes = [...fuck, {width:50, height:50, x: e.pageX - offset.left, y: e.pageY - offset.top - (this.state.height > 640 && ((this.state.height - 640)/2)), key: uuid, id: uuid, type: window.localStorage.chosenTool || Widget.Container, stageId: this.props.id, widgetProps: {}}]; // currentTool == 'text' ? Widget.Text : Widget.Empty
					
					this.setState({shapes: newShapes})
					setGlobalShapesByStage(this.props.id, newShapes);
				}
			}}>
				{ this.state.shapes.map(shapeProps => <ResizeDemo key={shapeProps.id} ref={shape => {
					this.sam[shapeProps.id] = shape;

				} } {...shapeProps} stageHeight={this.state.height} />) }
			</div>
		)
	}
}

export default Stage;
// render(<Stage />, document.getElementById('root'));
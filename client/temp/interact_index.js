import * as React from 'react';
import { render } from 'react-dom';
import ResizeDemo from '../../ResizeDemo';
import { Widget } from '../../enums';
import { setGlobalShapesByStage, loadGlobalShapes } from '../../GlobalState';

const uuidv1 = require('uuid/v1');

let { useState, createRef } = React;

// window.localStorage.removeItem('currentSelection');

let $ = window.$;

let stageShapes = [];

/*function setGlobalShapes(stageId, shapes) {
	window.localStorage.setItem('currentSelection', JSON.stringify({ stageId, shapes}));
}*/

// const Stage = ({id}) => {
class Stage extends React.PureComponent {
	// let ids = [uuidv1()];

	// let selectedGuy = null;
	
	/*let thatGuy = window.localStorage.currentSelection !== undefined ? JSON.parse(window.localStorage.currentSelection) : {};
	const [shapes, setShapes] = useState([{width: thatGuy.width || 300, height: thatGuy.height || 200, x: thatGuy.x || 0, y: thatGuy.y || 0, key: ids[0], id: ids[0], type: Widget.RaisedButton, stageId: id}] );*/

	/// const [shapes, setShapes]	  = useState(loadGlobalShapes(id, 'start') || []);
	/// const [selected, setSelected] = useState(null);
	
	constructor(props) {
		super(props)

		this.state = {
			shapes: loadGlobalShapes(this.props.id, 'start') || []
		};
	}

	/*componentDidMount() {
		this.setState({
			shapes: loadGlobalShapes(this.props.id, 'start'),
		})

		this.init = true
	}*/

	init = false;

	// shouldComponentUpdate(nextProps, nextState) {
		/*console.log('state same? ' + nextState == this.state)
		if(nextState == this.state) return false;
		console.dir(nextState);
		console.dir(nextState);

		return true;*/
		// return this.init;

	// }

	componentWillReceiveProps(nextProps){
		console.log('nextProps');
		console.dir(nextProps);

		console.log('---------------');

		console.log('this.props');
		console.dir(this.props);

	    /*if (nextProps.inputValue !== this.props.inputValue) {
	      this.setState({ inputVal: nextProps.inputValue })
	    }*/
	  }

	// stageShapes = shapes;
	// setGlobalShapesByStage(id, shapes);

	/*React.useEffect(function() {
	    localStorage.setItem("use-dark-mode", shapes);
	  }, [shapes]);*/

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

	// console.log('the stage id is ' + id);
	render() {
		return (
			<div onKeyDown={this.handleOnKeyDown} id={this.props.id} style={{width: '360px', height: '640px', border: 'solid 2px black'}} onMouseDown={e => {
				if(window.localStorage.getItem('currentTool') != 'rectangle') return;

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
					let newShapes = [...fuck, {width:50, height:50, x: e.pageX - offset.left, y: e.pageY - offset.top, key: uuid, id: uuid, type: Widget.Empty, stageId: this.props.id}];
					// setShapes(newShapes); // later also type property
					this.setState({shapes: newShapes})
					setGlobalShapesByStage(this.props.id, newShapes);
				}
			}}>
				{ this.state !== null && this.state.shapes.map(shapeProps => <ResizeDemo {...shapeProps} />) }
			</div>
		)
	}
}

export default Stage;
// render(<Stage />, document.getElementById('root'));
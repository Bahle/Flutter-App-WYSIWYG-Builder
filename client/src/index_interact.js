import * as React from 'react';
import { render } from 'react-dom';
import ResizeDemo from './ResizeDemo';
import { Widget } from './enums';

const uuidv1 = require('uuid/v1');

let { useState, createRef } = React;

let ids = [uuidv1()];

window.localStorage.removeItem('currentSelection');

let $ = window.$;

const Stage = ({id}) => {
	const elem = React.createRef()
	let selectedGuy = null
	
	const [shapes, setShapes] = useState([{width:300, height:200, key: ids[0], id: ids[0], type: Widget.RaisedButton, stageId: id}] );
	const [selected, setSelected] = useState(null);
	
	const handleOnKeyDown = (e) => {
		e.preventDefault();

		if(e.ctrlKey) {
			if(e.keyCode == 68) { // 'd' key
				let currentSelection = window.localStorage.getItem('currentSelection');
				if(!currentSelection) {
					alert('Please select an item to duplicate');
					return;
				}
				
				currentSelection = JSON.parse(currentSelection);

				let id = uuidv1();
				console.log(`new id: ${id}`);
				ids.push(id);
				console.log(ids);
				setShapes([...shapes, {x:0, y:0, width:currentSelection.width, height:currentSelection.height, key:id, id, type: currentSelection.type, stageId: id}]); // later also type property
			}
		}

		if(e.keyCode == 46) { // 'delete' key
			let currentSelection = window.localStorage.getItem('currentSelection');
			if(!currentSelection) {
				alert('Please select an item to delete');
				return;
			}

			// use the index of the ids array to get and remove the shape at relevant index
			// by duplicating the shapes array and splicing it at relevant index, then set the state object with the new array 
			let { id } = JSON.parse(currentSelection);
			// alert('what is key: ' + id);
			let elemIndex = ids.indexOf(id);
			// alert('what is ids: ' + ids);
			// alert('elemIndex: ' + elemIndex);
			ids.splice(1, 1);
			let dupli = Object.assign([], shapes);
			dupli.splice(1, 1);
			
			// console.log(JSON.stringify(shapes) + ' vs. ' + JSON.stringify(fuck));
			var fuck = shapes.filter(shape => shape.key != id);
			setShapes(fuck);

		}
	}


	return (
		<div onKeyDown={handleOnKeyDown} id={id} style={{width: '360px', height: '640px', border: 'solid 2px black'}} onMouseDown={e => {
			let target = e.target;
			if( $(target).hasClass('react-contextmenu-item') ) return;
			
			let uuid = uuidv1();
			// alert($(this).offset())
			console.clear();
			console.log('click target')
			console.dir(e.target)
			const offset = $(`#${id}`).offset(); // `#${id}`
			
			if($(target).parents('.widget').length == 0 && !$(target).is('.widget')) {
				setShapes([...shapes, {width:50, height:50, x: e.pageX - offset.left, y: e.pageY - offset.top, key: uuid, id: uuid, type: Widget.Empty, stageId: id}]); // later also type property
			}
		}}>
			{ shapes.map(shapeProps => <ResizeDemo {...shapeProps} />) }
		</div>
	)
}

// export default Stage;
render(<Stage id={'a' + uuidv1()} />, document.getElementById('root'));
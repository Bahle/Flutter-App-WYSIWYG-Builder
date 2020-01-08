import * as React from 'react';
// import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import reactable from 'reactablejs'
import Demo from './Demo';
import { render } from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from 'react-contextmenu'
import './css/react-contextmenu.css';
import './css/custom-contextmenu.css';
import PersonIcon from '@material-ui/icons/Person';
import interact from 'interactjs';
import { Widget } from './enums';
import { setGlobalShapesByShape } from './GlobalState';


const Reactable = reactable(Demo);


const ResizeDemo = ({id, stageId, type, x, y, width, height, key, widgetProps, isFocused = false}) => {
  /*let [offset, setOffset] = React.useState(0);
  setTimeout(() => {
  	setOffset(window.$('#' + stageId).offset())
  }, 1000)*/

  const [coordinate, setCoordinate] = React.useState({ x: x || 0, y: y || 0, width: width || 30, height: height || 30, isFocused, id, type, stageId, key: id, widgetProps });
  const [focused, setFocused] = React.useState(false);

	/*let dataItem = null;

  React.useEffect(() => {
     // console.clear();
     dataItem = type; 
  }, type); //Pass Array as second argument*/

  const handleMenuClick = (event, data) => {
    // alert('happening: ' + Widget[event.target.innerHTML])
    let newProps = {...coordinate, type: data.item};
    setCoordinate(newProps) // why not persisting type???
    
    setGlobalShapesByShape(newProps)
    // setTimeout(() => alert(JSON.stringify(coordinate)), 1000);
    // dataItem = data.item;
  }

  const helloWorld = () => alert('hello world');

  const attributes = {
    className: 'custom-root',
    disabledClassName: 'custom-disabled',
    dividerClassName: 'custom-divider',
    selectedClassName: 'custom-selected'
  }

  return (
  	// <div onBlur={(e) => { setCoordinate({ ...coordinate, isFocused: false }) /*setFocused(false);*/ } } >
  	<div>
  		<ContextMenuTrigger key={`z${id}`} id={id} holdToDisplay={100000}>
		    <Reactable
		      	draggable={{
		        // onstart: action('DragStart'),
		        onmove: event => {
              // console.log(dataItem)
		          // console.dir(event);
		          const { width, height } = event.rect;


		          setCoordinate(prev => {
          		      let moveLeft = prev.x + event.dx,
          		        	moveTop  = prev.y + event.dy;
          		      if(moveLeft < 0) {
          		      	moveLeft = 0;
          		      } else if(width + moveLeft > 360) {
          		       moveLeft = 360 - width;
          		      }
          		      
          		      if(moveTop < 0) {
          		      	moveTop = 0;
          			  } else if(height + moveTop > 640) {
          		       moveTop = 640 - height;
          		      }		

                const result = {
                  x: moveLeft,
                  y: moveTop,
                  width,
                  height,
                  id,
                  stageId,
                  key: id,
                  type: JSON.parse(window.localStorage.currentSelection).type,
                  isFocused,
                  widgetProps
                  // isFocused: true <- start from here
                }

                setGlobalShapesByShape(result)

			          return result;
		          });

		          //setFocused(true);
		      	},
		        modifiers: [
			        /* interact.modifiers.snap({
			        	// targets: [ { y: 300 }, { y: 200 }, { x: 300 }, { x: 200 } ], // add dynamically later
			        	relativePoints: [{ x: 0 , y: 0 }, { x: 1, y: 1 }],
            			range: 10
			        }) */
			        /*interact.modifiers.restrictRect({
                      restriction: {
                      	left: offset === undefined  ? offset.left : 0,
                      	top: offset === undefined  ? offset.top : 0
                      },
                      endOnly: true,
                    }),*/
		    	]
		      }}
		      resizable={{
		        edges: { left: true, right: true, bottom: true, top: true },
		        /*modifiers: [
                    interact.modifiers.restrictEdges({
                      outer: {
                      	left: offset === undefined  ? offset.left : 0,
                      	top: offset === undefined  ? offset.top : 0
                      },
                      endOnly: true,
                    }),
                  ],*/
		      }}
		      // onTap={(e) => { console.clear(); console.log(e.rect); } }
		      onResizeMove={e => {
            // console.log(dataItem)
		        let { width, height } = e.rect;
		        const { left, top } = e.deltaRect;

		        setCoordinate(prev => {
                  let moveLeft = prev.x + left,
                  	  moveTop  = prev.y + top;

                  if(moveLeft < 0) moveLeft = 0;
                  if(moveTop < 0) moveTop = 0;

                  if(width > 360) width = 360;
                  if(height > 640) height = 640;

                  /*if(width + moveLeft > 360) {
                  	moveLeft = 360 - width;
                  }

          		  if(height + moveTop > 640) {
                  	moveTop = 640 - height;
                  }		*/        
              console.log('onResizeMove');
		          const result = {
                x: moveLeft,
                y: moveTop,
                width,
                height,
                id,
                stageId,
                key: id,
                type: JSON.parse(window.localStorage.currentSelection).type,
                isFocused,
                widgetProps
                // isFocused: true
              }
              // console.log('Fucking results: ' + JSON.stringify(result))
              // console.log(`The bubble up. Width: ${width}, height: ${height} => ${id}`);
              setGlobalShapesByShape(result)

              return result;
		        });

		        //setFocused(true);
		      }}
		      {...coordinate}
		    />
		</ContextMenuTrigger>
	    {<ContextMenu id={id}>
            <SubMenu title='Basic' hoverDelay={125}>
                <SubMenu title='Button' hoverDelay={125}>
                    <MenuItem data={{ item: Widget.RaisedButton }} onClick={handleMenuClick}>Raised</MenuItem>
                    <MenuItem data={{ item: Widget.FlatButton }} onClick={handleMenuClick}>Flat</MenuItem>
                    <MenuItem onClick={handleMenuClick} data={{ item: Widget.OutlineButton }}>Outline</MenuItem>
                    <MenuItem onClick={handleMenuClick} data={{ item: Widget.IconButton }}>Icon</MenuItem>
                    <MenuItem onClick={handleMenuClick} data={{ item: Widget.FloatingActionButton }}>FloatingAction</MenuItem>
                </SubMenu>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Text }}>Text</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Image }}>Image</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Card }}>Card</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.RichText }}>RichText</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Icon }}>Icon</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.ListTile }}>ListTile</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Chip }}>Chip</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Divider }}>Divider</MenuItem>
            </SubMenu>
            <SubMenu title='Containers' hoverDelay={125}>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Row }}>Row</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Column }}>Column</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.ListView }}>ListView</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.GridView }}>GridView</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Wrap }}>Wrap</MenuItem>
            </SubMenu>
            <SubMenu title='Input' hoverDelay={125}>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.TextField }}>TextField</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Slider }}>Slider</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.DropdownButton }}>DropdownButton</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Radio }}>Radio</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Checkbox }}>Checkbox</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Switch }}>Switch</MenuItem>
            </SubMenu>
            <SubMenu title='Layout' hoverDelay={125}>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.TabBar }}>TabBar</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.BottomNavigationBar }}>BottomNavigationBar</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Stepper }}>Stepper</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.PageView }}>PageView</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.ExpansionPanel }}>ExpansionPanel</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.IndexedStack }}>IndexedStack</MenuItem>
            </SubMenu>
            <SubMenu title='3rd Party' hoverDelay={125}>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Carousel }}>Carousel</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Map }}>Map</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Webview }}>Webview</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Swipe_Cards }}>Swipe Cards</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.SMS_Code_Confirm }}>SMS Code Confirm</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.Country_Picker }}>Country Picker</MenuItem>
                <MenuItem onClick={handleMenuClick} data={{ item: Widget.AutoComplete }}>AutoComplete</MenuItem>
            </SubMenu>
        </ContextMenu>}
    </div>
	// </div>
  );
};

export default ResizeDemo;
// render(<ResizeDemo />, document.getElementById('root'));
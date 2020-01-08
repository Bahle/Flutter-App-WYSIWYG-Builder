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

//! Another annoying pointer
// functional comp does not take a ref
class ResizeDemo extends React.Component {
  constructor(props) {
    super(props);

    const {id, stageId, type, x, y, width, height, key, widgetProps, isFocused = false} = this.props;

    this.state = {
      coordinate: { x: x || 0, y: y || 0, width: width || 30, height: height || 30, isFocused, id, type, stageId, key: id, widgetProps },
      focused: false
    }
  }
  /*let [offset, setOffset] = React.useState(0);
  setTimeout(() => {
  	setOffset(window.$('#' + stageId).offset())
  }, 1000)*/

  /*const [coordinate, setCoordinate] = React.useState({ x: x || 0, y: y || 0, width: width || 30, height: height || 30, isFocused, id, type, stageId, key: id, widgetProps });
  const [focused, setFocused] = React.useState(false);*/

	/*let dataItem = null;

  React.useEffect(() => {
     // console.clear();
     dataItem = type; 
  }, type); //Pass Array as second argument*/

  handleMenuClick = (event, data) => {
    // alert('happening: ' + Widget[event.target.innerHTML])
    let newProps = {...this.state.coordinate, type: data.item};
    // setCoordinate(newProps) // why not persisting type???
    this.setState({coordinate: newProps});
    
    setGlobalShapesByShape(newProps)
    // setTimeout(() => alert(JSON.stringify(coordinate)), 1000);
    // dataItem = data.item;
  }

  helloWorld = () => {
    alert('helloWorld')
    let newProps = {...this.state.coordinate, widgetProps: 'Yah neh'};
    // setCoordinate(newProps) // why not persisting type???
    this.setState({coordinate: newProps});
    
    setGlobalShapesByShape(newProps)
  }

  setText = text => {
    // alert('setting text: ' + text);
    const newProps = {...this.state.coordinate, widgetProps: {text}};
    this.setState({coordinate: newProps});
    setGlobalShapesByShape(newProps);
  }

  attributes = {
    className: 'custom-root',
    disabledClassName: 'custom-disabled',
    dividerClassName: 'custom-divider',
    selectedClassName: 'custom-selected'
  }

  render() {
    return (
    	// <div onBlur={(e) => { setCoordinate({ ...coordinate, isFocused: false }) /*setFocused(false);*/ } } >
    	<div>
    		<ContextMenuTrigger key={`z${this.props.id}`} id={this.props.id} holdToDisplay={100000}>
  		    <Reactable
  		      	draggable={{
  		        // onstart: action('DragStart'),
  		        onmove: event => {
                // console.log(dataItem)
  		          // console.dir(event);
  		          const { width, height } = event.rect;


  		          this.setState(prev => {
                  // alert('prev: ' + JSON.stringify(prev))
            		      let moveLeft = prev.coordinate.x + event.dx,
            		        	moveTop  = prev.coordinate.y + event.dy;
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
                    width: this.state.coordinate.width,
                    height: this.state.coordinate.height,
                    id: this.state.coordinate.id,
                    stageId: this.state.coordinate.stageId,
                    key: this.state.coordinate.id,
                    type: JSON.parse(window.localStorage.currentSelection).type,
                    isFocused: this.state.coordinate.isFocused,
                    widgetProps: {text: this.state.coordinate.widgetProps} // <- start here by making sure widgetProps is object not text,
                    // isFocused: true <- start from here
                  }

                  setGlobalShapesByShape(result)

  			          return { coordinate: result };
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

  		        this.setState(prev => {
                    let moveLeft = prev.coordinate.x + left,
                    	  moveTop  = prev.coordinate.y + top;

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
                  id: this.state.coordinate.id,
                  stageId: this.state.coordinate.stageId,
                  key: this.state.coordinate.id,
                  type: JSON.parse(window.localStorage.currentSelection).type,
                  isFocused: this.state.coordinate.isFocused,
                  widgetProps: {text: this.state.coordinate.widgetProps} // <- start here by making sure widgetProps is object not text,
                  // isFocused: true
                }
                // console.log('Fucking results: ' + JSON.stringify(result))
                // console.log(`The bubble up. Width: ${width}, height: ${height} => ${id}`);
                setGlobalShapesByShape(result)

                return {coordinate: result};
  		        });

  		        //setFocused(true);
  		      }}
  		      {...this.state.coordinate}
  		    />
  		</ContextMenuTrigger>
  	    {<ContextMenu id={this.props.id}>
              <SubMenu title='Basic' hoverDelay={125}>
                  <SubMenu title='Button' hoverDelay={125}>
                      <MenuItem data={{ item: Widget.RaisedButton }} onClick={this.handleMenuClick}>Raised</MenuItem>
                      <MenuItem data={{ item: Widget.FlatButton }} onClick={this.handleMenuClick}>Flat</MenuItem>
                      <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.OutlineButton }}>Outline</MenuItem>
                      <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.IconButton }}>Icon</MenuItem>
                      <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.FloatingActionButton }}>FloatingAction</MenuItem>
                  </SubMenu>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Text }}>Text</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Image }}>Image</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Card }}>Card</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.RichText }}>RichText</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Icon }}>Icon</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.ListTile }}>ListTile</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Chip }}>Chip</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Divider }}>Divider</MenuItem>
              </SubMenu>
              <SubMenu title='Containers' hoverDelay={125}>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Row }}>Row</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Column }}>Column</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.ListView }}>ListView</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.GridView }}>GridView</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Wrap }}>Wrap</MenuItem>
              </SubMenu>
              <SubMenu title='Input' hoverDelay={125}>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.TextField }}>TextField</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Slider }}>Slider</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.DropdownButton }}>DropdownButton</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Radio }}>Radio</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Checkbox }}>Checkbox</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Switch }}>Switch</MenuItem>
              </SubMenu>
              <SubMenu title='Layout' hoverDelay={125}>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.TabBar }}>TabBar</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.BottomNavigationBar }}>BottomNavigationBar</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Stepper }}>Stepper</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.PageView }}>PageView</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.ExpansionPanel }}>ExpansionPanel</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.IndexedStack }}>IndexedStack</MenuItem>
              </SubMenu>
              <SubMenu title='3rd Party' hoverDelay={125}>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Carousel }}>Carousel</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Map }}>Map</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Webview }}>Webview</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Swipe_Cards }}>Swipe Cards</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.SMS_Code_Confirm }}>SMS Code Confirm</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.Country_Picker }}>Country Picker</MenuItem>
                  <MenuItem onClick={this.handleMenuClick} data={{ item: Widget.AutoComplete }}>AutoComplete</MenuItem>
              </SubMenu>
          </ContextMenu>}
      </div>
  	// </div>
    );
  }
};

export default ResizeDemo;
// render(<ResizeDemo />, document.getElementById('root'));
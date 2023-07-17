import * as React from 'react';
import reactable from 'reactablejs'
import Demo from './Demo';
import { render } from 'react-dom';
/*import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from 'react-contextmenu'
import './css/react-contextmenu.css';
import './css/custom-contextmenu.css';*/
import PersonIcon from '@material-ui/icons/Person';
// import interact from 'interactjs';
import { Widget } from './enums';
import { setGlobalShapesByShape, getShapeWidgetProps } from './GlobalState';

import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import { EventEmitter } from './utils/Events.js'
import { actions } from './utils'

import deepCopy from './utils/DeepCopy'
import './ResizeDemo.css'

const uuid = require('uuid/v4');

const PageView = {
  Design: 'Design',
  Preview: 'Preview'
}

const Reactable = reactable(Demo);

//! Another annoying pointer
// functional comp does not take a ref
class ResizeDemo extends React.Component {
  constructor(props) {
    super(props);

    const {id, stageId, type, x, y, width, height, widgetProps = {}, isFocused = false, grandParentStage} = this.props;

    this.state = {
      coordinate: { x: x || 0, y: y || 0, width: width || 50, /*type,*/ height: height || 50, isFocused, id, /*type,*/ stageId, key: id, widgetProps, grandParentStage },
      focused: false,
      type
    }

    actions.forEach(action => {
      this[action] = value => {
        const prop = action.slice(3).toLowerCaseFirst()
        
        const newProps = {...this.state.coordinate, widgetProps: {...this.state.coordinate.widgetProps, [prop]: value }};
        this.setState({coordinate: newProps});
        setGlobalShapesByShape(newProps);

        console.log('updated prop to: ' + prop + ' value: ' + value)
      }
    })

    EventEmitter.subscribe('makeRepeatable', this.handleMakeRepeatable.bind(this));
    EventEmitter.subscribe('togglePageView', this.togglePageView.bind(this));
    EventEmitter.subscribe('setX', this.setX.bind(this))
    EventEmitter.subscribe('setY', this.setY.bind(this))
  }
  
  setX(value) {
    if( window.localStorage.currentSelection && JSON.parse(window.localStorage.currentSelection).id == this.props.id ) { // make sure currentSelection only applies this.props 
      let coordinate = Object.assign({}, this.state.coordinate)
      coordinate.x = value

      this.setState({coordinate}) // , console.log('coordinate is now: ', this.state.coordinate)
      const result = { ...this.state.coordinate, type: JSON.parse(window.localStorage.currentSelection).type }
      setGlobalShapesByShape(result)
    }
  }

  setY(value) {
    if( window.localStorage.currentSelection && JSON.parse(window.localStorage.currentSelection).id == this.props.id ) { // make sure currentSelection only applies this.props 
      let coordinate = Object.assign({}, this.state.coordinate)
      coordinate.y = value

      this.setState({coordinate}) // , console.log('coordinate is now: ', this.state.coordinate)
      const result = { ...this.state.coordinate, type: JSON.parse(window.localStorage.currentSelection).type }
      setGlobalShapesByShape(result)
    }
  }

  PAGEITEMCOUNT = 10

  togglePageView(pageView) {
    // const { widgetProps } = this.state.coordinate; // don't use widgetProps from props because they do not update after state change
    const widgetProps = getShapeWidgetProps(this.props)
    // alert('widgetProps.type: ' + widgetProps.type)
    // alert(JSON.stringify(widgetProps))
          

    if(pageView == PageView.Preview) {
      if( widgetProps.modelFields ) {
        
      } else if( widgetProps.model && JSON.parse(widgetProps.repeatable) ) {
        // alert(1)
        if(widgetProps.type == 'Column') {
          // alert('widgetProps.type: ' + widgetProps.type)
          this.setState({ coordinate: {...this.state.coordinate, height: this.state.coordinate.height * this.PAGEITEMCOUNT} })
          this.repeatStageObjects();
        } else if(widgetProps.type == 'ListView') {
          // alert('widgetProps.type: ' + widgetProps.type)
          EventEmitter.dispatch('setInnerHeight', this.state.coordinate.height * this.PAGEITEMCOUNT);
          this.repeatStageObjects();
        } else if(widgetProps.type == 'GridView') {
          // alert('GridView')
          // alert('widgetProps.type: ' + widgetProps.type)
          this.repeatStageObjects(widgetProps.type)
        }
      }
    } else if(pageView == PageView.Design) {
      if(!this.hasRepeatedObjects) return; // do nothin if nothing has been repeated


      if(widgetProps.type == 'Column') {
        EventEmitter.dispatch('removeRepeatObjects');
        this.setState({ coordinate: {...this.state.coordinate, height: this.state.coordinate.height / this.PAGEITEMCOUNT} })
      } else if(widgetProps.type == 'ListView') {
        EventEmitter.dispatch('setInnerHeight', this.state.coordinate.height / this.PAGEITEMCOUNT);
        this.setState({ coordinate: {...this.state.coordinate, height: this.state.coordinate.height / this.PAGEITEMCOUNT} })
      } else if(widgetProps.type == 'GridView') {
        EventEmitter.dispatch('removeRepeatObjects');
      }

      this.hasRepeatedObjects = false;
    }
  }

  repeatStageObjects(type='Column') {
    // alert(type)
    const stageId = this.props.id;
    // const { widgetProps } = this.state.coordinate;
    const widgetProps = getShapeWidgetProps(this.props)
    const modelData = JSON.parse(window.localStorage.modelData).find(model => model.name == widgetProps.model);

    const fieldRequires = {};

    // get all the field names then require them same time
    modelData.fields.forEach( field => { 
      fieldRequires[field.fieldName] = require(`./json/${ field.dataType.replace(' ', '_').toLowerCase() }.js`)
    });

    const objects = JSON.parse(window.localStorage['stage_' + stageId])
    const extraObjects = [];

    if(type == 'Column' || type == 'ListView') {
      for(const key in objects) {
        for(let i = 1; i < 10; i++) {
          const object = deepCopy(objects[key]) // Object.assign({}, 
          if( !fieldRequires[object.widgetProps.modelField] ) continue;
          
          object.y += i * this.state.coordinate.height;
          object.id = object.key = uuid()
          object.isRepeatObject = true;
          
          // if(fieldRequires[object.widgetProps.modelField]) {
            object.widgetProps.text = fieldRequires[object.widgetProps.modelField].default[Math.round(Math.random() * 50) - 1]
            extraObjects.push(object);
          // }
        }
      }
    } else if(type == 'GridView') {
      for(let i = 0; i < 10; i++) {
        const object = {}

        object.widgetProps = {};
        object.widgetProps.children = Object.values(objects).map(object => {
          object = deepCopy(object)

          if( fieldRequires[object.widgetProps.modelField] ) {
            object.widgetProps.text = fieldRequires[object.widgetProps.modelField].default[Math.round(Math.random() * 50) - 1]
          }
          object.widgetProps.inGridItem = true;
          return object;
        })
        // object.width = 360 / (widgetProps.columnCount || 3 ) // 3 is the default
        // alert('object.width: ' + object.width)
        object.height = this.state.coordinate.height
        object.type = Widget.GridItem
        object.id = object.key = uuid()
        object.isRepeatObject = true;
        object.widgetProps.columnCount = widgetProps.columnCount || 3
        object.stageId = stageId
        
        extraObjects.push(object);
      }
    }

   /* alert('extraObjects: ' + JSON.stringify(extraObjects))
    console.clear()
    console.log('koria!')
    console.dir(extraObjects)*/
    if(extraObjects.length) this.hasRepeatedObjects = true;
    EventEmitter.dispatch('addRepeatObjects', {stageId, extraObjects})
  }

  handleMakeRepeatable({stageId: grandParentStage, id: parentStage, foundShapes}) {
    if(Object.entries(foundShapes).some(entry => { console.log(entry[1].id + ' vs. ' + this.state.coordinate.id); return entry[1].id == this.state.coordinate.id })) { // foundShapes.some(shape => shape.id == this.state.coordinate.id)
      const { coordinate } = this.state;
      alert('yippe!!! ' + parentStage)
      this.setState({...coordinate, stageId: parentStage})
    }
  }

  // types of containers: row, column, listview, grid, wrap
  findWidgetsContained() {
    // first get the container stage
    /*console.clear()
    console.log('stage: ' + stageId)
    console.log(window.localStorage['stage_' + stageId])*/
    const stage = JSON.parse(window.localStorage['stage_' + this.props.stageId]);

    const {id, stageId, x, y, width, height, widgetProps} = stage[this.props.id];
    if(widgetProps.repeatable) {
      alert('The component is already a repeatable container');
      return;
    }

    const bounds = {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height
    }

    let foundShapes = {}; // an array to be used to get the shapes that have been moved to help with keeping track with stage changes

    for(const shapeId in stage) {
      let widget = stage[shapeId];
      const shape = {
        left: widget.x,
        right: widget.x + widget.width,
        top: widget.y,
        bottom: widget.y + widget.height
      }

      /*console.log('checking shape: ' + JSON.stringify(widget))
      if(widget.id == 'a285b08c0-4cf3-11ea-8910-dbab2ca5746a') {
        console.log('bounds: ' + JSON.stringify(bounds))
        console.log('shape: ' + JSON.stringify(shape))
      }*/

      if(widget.id != id && shape.left >= bounds.left && shape.right <= bounds.right && shape.top >= bounds.top && shape.bottom <= bounds.bottom ) {
        // foundShapes.push(widget)
        widget.x = shape.left - bounds.left;
        widget.y = shape.top - bounds.top;
        widget.stageId = id;
        widget.grandParentStage = stageId;

        foundShapes[widget.id] = widget
      }
    }

    window.localStorage.movedShapes = JSON.stringify(foundShapes)

    // create stage
    alert('fucking id: ' + id)
    console.log('fucking id: ' + id)
    window.localStorage['stage_' + id] = JSON.stringify(foundShapes);

    if(foundShapes == {}) {
      alert('!!!No widgets found within container!!!');
      return;
    }

    widgetProps.repeatable = 'true';
    const newProps = { ...stage[this.props.id], widgetProps }

    let remainingShapes = {}
    for(const shapeId in stage) {
      if(Object.keys(foundShapes).indexOf(shapeId) == -1) {
        if(shapeId != id) {
          remainingShapes[shapeId] = stage[shapeId];
        } else {
          remainingShapes[shapeId] = newProps;
        }
      }
    }

    console.log('remainingShapes: ' + JSON.stringify(remainingShapes))
    // only write those shapes that weren't matched, hence removing them from the stage
    window.localStorage['stage_' + stageId] = JSON.stringify(remainingShapes)
    
    const pages = JSON.parse(window.localStorage.pages)
    pages.push({
      belongsTo: `${id}`, //"abb312040-77e0-11ea-9240-5d1f510bec02"
      id: `stage_${id}`,
      key: `stage_${id}`,
      name: `${id}`,
      type: 'Container'
    })

    window.localStorage.pages = JSON.stringify(pages)

    // this.setState({coordinate: newProps}, () => alert('state updated')); // <- start here, not working
    EventEmitter.dispatch('makeRepeatable', {stageId, id, foundShapes}); // widgetProps is derived from internal state in Demo comp, hence have to emit
  }

handleMenuClick = ({props: {item}}) => {
    // alert('handleMenuClick');
    if(item == 'Repeatable') {
      //EventEmitter.dispatch('makeRepeatable', )
      this.findWidgetsContained();

      return;
    } else if(item == 'AddToBounding') {
      this.addToBoundingContainer();

      return;
    } else if(item == 'SendToBack') {
      EventEmitter.dispatch('sendToBack', {id: this.props.id, stageId: this.props.stageId})

      return;
    }

    let newProps; // = {...this.state.coordinate, 'type': item}; // event.target.innerHTML

    // accommodate for new stage(s) when creating new tabBar
    if(item == 'TabBar' || item == 'BottomNavigationBar' || item == 'PageView') {
      const pages = JSON.parse(window.localStorage.pages);
      const tabContent = item == 'TabBar' ? 'Tab 1\nTab 2\nTab 3' : 'Page 1\nPage 2\nPage 3';
      if( !pages.some(page => page.belongsTo == this.props.id)) { // array.some == array.contains
        // initialize with 3 tabs by default
        for(var a in [1,2,3]) {
          const tabName = `stage_${this.props.id}_tab${a}`;
          pages.push({ type: 'TabView', belongsTo: this.props.id, name: tabName, id: tabName, key: tabName })
        }
        
        window.localStorage.pages = JSON.stringify(pages);
        EventEmitter.dispatch('setTabs', tabContent)
      }
      newProps = {...this.state.coordinate, 'type': item, widgetProps: {...this.state.widgetProps, tabs: tabContent} }; // event.target.innerHTML

    } else {
      newProps = {...this.state.coordinate, 'type': item }; // event.target.innerHTML
    }

    // alert('type: ' + item)

    window.localStorage.setItem('currentSelection', JSON.stringify(newProps));
    setGlobalShapesByShape(newProps)
    
    // this.forceUpdate()
    this.setState({coordinate: newProps})
  }

  addToBoundingContainer() {
    // alert('yebo')
    // const {stageId, widgetProps}
    const stage = JSON.parse(window.localStorage['stage_' + this.props.stageId]);

    const {id, stageId, x, y, width, height, widgetProps} = stage[this.props.id];

    const stageShapes =  JSON.parse(window.localStorage['stage_' + stageId])
    const thisObject = deepCopy(this.state.coordinate); // is deepCopy necessary

    const shape = {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height
    }
    
    let repeatObjectFound = false;

    console.clear();
    console.log('koria!')
    console.dir('stageShapes: ', stageShapes)
    for(const shapeId in stageShapes) {
      const widget = stageShapes[shapeId]
      console.log('FUCK THIS SHIT:', widget.widgetProps.repeatable)
      if(!widget.widgetProps.repeatable) continue;

      const bounds = {
        left: widget.x,
        right: widget.x + widget.width,
        top: widget.y,
        bottom: widget.y + widget.height
      }

      console.log('shape.left', shape.left, 'bounds.left', bounds.left, `results: ${shape.left >= bounds.left}`)
      console.log('shape.right', shape.right, 'bounds.right', bounds.right, `results: ${shape.right <= bounds.right}`)
      console.log('bounds.right', bounds.right, 'shape.top', shape.top, `results: ${shape.top >= bounds.top}`)
      console.log('shape.bottom', shape.bottom, 'bounds.bottom', bounds.bottom, `results: ${shape.bottom <= bounds.bottom}`)
      if(shape.left >= bounds.left && shape.right <= bounds.right && shape.top >= bounds.top && shape.bottom <= bounds.bottom ) {
        // foundShapes.push(widget)
        thisObject.x = shape.left - bounds.left;
        thisObject.y = shape.top - bounds.top;
        thisObject.stageId = widget.id;
        thisObject.grandParentStage = widget.stageId;

        if(!widget.widgetProps) widget.widgetProps = {};
        widget.widgetProps.repeatable = 'true'

        // foundShapes[widget.id] = widget;

        // if(!widget.isRepeatObject) widget.isRepeatObject = true;
        repeatObjectFound = true;

        if(window.confirm('Would you like to add this shape to the ' + widget.type + ' ' + widget.id)) {
          // window.localStorage['stage_' + stageId] = JSON.stringify(remainingShapes)

          EventEmitter.dispatch('addToBoundingContainer', {thisObject, widget})
          // EventEmitter.dispatch('makeRepeatable', {stageId, id, foundShapes});
          
          break;
        }
      }
    }

    if(!repeatObjectFound) alert('No repeat object found. Please make sure to convert containers to repeat objects to add additional objects')
  }

  /*attributes = {
    className: 'custom-root',
    disabledClassName: 'custom-disabled',
    dividerClassName: 'custom-divider',
    selectedClassName: 'custom-selected'
  }*/

  render() {
    return (
      // <div onBlur={(e) => { setCoordinate({ ...coordinate, isFocused: false }) /*setFocused(false);*/ } } >
      <div style={this.state.coordinate.type != Widget.GridItem ? {} : {display: 'inline-block', width: (100 / this.state.coordinate.widgetProps.columnCount) + '%'}} onKeyDown={e => {
          e.preventDefault()
          
          let { x, y } = this.state.coordinate;
          let coordinate = Object.assign({}, this.state.coordinate)
          
          console.log('e.key: ', e.key)

          if(e.key == 'ArrowUp') {
            y = parseFloat(y) - (e.shiftKey ? 15 : 3)
          } else if(e.key == 'ArrowDown') {
            y = parseFloat(y) + (e.shiftKey ? 15 : 3)
          } else if(e.key == 'ArrowLeft') {
            x = parseFloat(x) - (e.shiftKey ? 15 : 3)
          } else if(e.key == 'ArrowRight') {
            x = parseFloat(x) + (e.shiftKey ? 15 : 3)
          }

          coordinate.x = x
          coordinate.y = y

          // console.log('coordinate.x: ', coordinate.x)
          // console.log('coordinate.y: ', coordinate.y)

          this.setState({coordinate}) // , console.log('coordinate is now: ', this.state.coordinate)

          const result = { ...this.state.coordinate, type: JSON.parse(window.localStorage.currentSelection).type }

          setGlobalShapesByShape(result)

        }}>
        <MenuProvider id={`z${this.props.id}`} type={this.props.type} style={{display: this.state.coordinate.type != Widget.GridItem ? 'block' : 'inline-block', width: '100%'}}>
          <Reactable
              ref={(ref) => this.fuckRef = ref}
              draggable={{
              // onstart: action('DragStart'),
              onmove: event => {
                // console.log(dataItem)
                // console.dir(event);
                const { width, height } = event.rect;
                // alert('onmove')

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
                    } else if(height + moveTop > this.props.stageHeight) {
                       moveTop = this.props.stageHeight - height;
                      }   

                  /*const result = {
                    x: moveLeft,
                    y: moveTop,
                    width: this.state.coordinate.width,
                    height: this.state.coordinate.height,
                    id: this.state.coordinate.id,
                    stageId: this.state.coordinate.stageId,
                    key: this.state.coordinate.id,
                    type: JSON.parse(window.localStorage.currentSelection).type,
                    isFocused: this.state.coordinate.isFocused,
                    widgetProps: this.state.coordinate.widgetProps // <- start here by making sure widgetProps is object not text,
                    // isFocused: true <- start from here
                  }*/

                  const result = { ...this.state.coordinate, x: moveLeft, y: moveTop, type: JSON.parse(window.localStorage.currentSelection).type }

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
                /*interact.modifiers.restrict({
                  restriction: 'parent',
                  endOnly: true
                })*/
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
              // alert('onResizeMove')
              // console.log(dataItem)
              let { width, height } = e.rect;
              const { left, top } = e.deltaRect;

              console.clear();
              console.log(this.props.stageHeight)

              this.setState(prev => {
                    let moveLeft = prev.coordinate.x + left,
                        moveTop  = prev.coordinate.y + top;

                    if(moveLeft < 0) moveLeft = 0;
                    if(moveTop < 0) moveTop = 0;

                    if(width > 360) width = 360;
                    if(height > this.props.stageHeight) height = this.props.stageHeight;

                    /*if(width + moveLeft > 360) {
                      moveLeft = 360 - width;
                    }

                  if(height + moveTop > 640) {
                      moveTop = 640 - height;
                    }   */        
                // console.log('onResizeMove');
                /*const result = {
                  x: moveLeft,
                  y: moveTop,
                  width,
                  height,
                  id: this.state.coordinate.id,
                  stageId: this.state.coordinate.stageId,
                  key: this.state.coordinate.id,
                  type: JSON.parse(window.localStorage.currentSelection).type,
                  isFocused: this.state.coordinate.isFocused,
                  widgetProps: this.state.coordinate.widgetProps // <- start here by making sure widgetProps is object not text,
                  // isFocused: true
                }*/

                const result = { ...this.state.coordinate, x: moveLeft, y: moveTop, width, height, type: JSON.parse(window.localStorage.currentSelection).type }
                // console.log('Fucking results: ' + JSON.stringify(result))
                // console.log(`The bubble up. Width: ${width}, height: ${height} => ${id}`);
                setGlobalShapesByShape(result)

                return {coordinate: result};
              });

              //setFocused(true);
            }}

            {...this.state.coordinate}
          />
      </MenuProvider>
      
      <Menu id={`z${this.props.id}`} delay={0}>
          <Submenu label='Basic'>
            <Submenu label='Button'>
                {/* <Item><div onMouseDown={ () => this.handleMenuClick({props: {item: Widget.RaisedButton}}) } data={{ item: Widget.RaisedButton }}>Raised</div></Item> */}
                <Item onClick={this.handleMenuClick} data={{ item: Widget.RaisedButton }}>Raised <small>B</small></Item>
                <Item onClick={this.handleMenuClick} data={{ item: Widget.FlatButton }}>Flat <small>B</small></Item>
                <Item onClick={this.handleMenuClick} data={{ item: Widget.OutlineButton }}>Outline <small>B</small></Item>
                <Item onClick={this.handleMenuClick} data={{ item: Widget.IconButton }}>Icon <small>B</small></Item>
                <Item onClick={this.handleMenuClick} data={{ item: Widget.FloatingActionButton }}>FloatingAction <small>B</small></Item>
                <Item onClick={this.handleMenuClick} data={{ item: Widget.DropdownButton }}>DropdownButton <small>B</small></Item>
                <Item onClick={this.handleMenuClick} data={{ item: Widget.PopupMenuButton }}>PopupMenuButton <small>B</small></Item>
            </Submenu>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Text }}>Text <small>T</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Image }}>Image <small>I</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Card }}>Card <small>C</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.RichText }}>RichText</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.AppBar }}>AppBar <small>A</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Icon }}>Icon</Item>
            <Submenu label='ListTile'>
              <Item onClick={this.handleMenuClick} data={{ item: Widget.ListTile }}>Single <small>L</small></Item>
              <Item onClick={this.handleMenuClick} data={{ item: Widget.ListTiles }}>Multiple <small>L</small></Item>
            </Submenu>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Chip }}>Chip</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Divider }}>Divider</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Progress }}>Progress</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Placeholder }}>Placeholder</Item>
        </Submenu>
        <Submenu label='Containers'>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Container }}>Container <small>C</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Paper }}>Paper <small>P</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Row }}>Row</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Column }}>Column</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.ListView }}>ListView</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.GridView }}>GridView</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Wrap }}>Wrap</Item>
        </Submenu>
        <Submenu label='Input'>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.TextField }}>TextField <small>T</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Slider }}>Slider <small>S</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Radio }}>Radio <small>R</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Checkbox }}>Checkbox <small>C</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Switch }}>Switch <small>S</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.DatePicker }}>DatePicker <small>D</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.TimePicker }}>TimePicker <small>T</small></Item>
        </Submenu>
        <Submenu label='Layout'>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.TabBar }}>TabBar <small>T</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.BottomNavigationBar }}>BottomNavigationBar <small>B</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Stepper }}>Stepper</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.PageView }}>PageView</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.ExpansionPanel }}>ExpansionPanel</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.IndexedStack }}>IndexedStack</Item>
        </Submenu>
        <Submenu label='3rd Party'>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Carousel }}>Carousel <small>C</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Map }}>Map</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Webview }}>Webview</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Rating }}>Rating <small>R</small></Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Swipe_Cards }}>Swipe Cards</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.SMS_Code_Confirm }}>SMS Code Confirm</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.Country_Picker }}>Country Picker</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.AutoComplete }}>AutoComplete</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.ChatWindow }}>ChatWindow</Item>
            <Item onClick={this.handleMenuClick} data={{ item: Widget.SpeedDial }}>SpeedDial</Item>
        </Submenu>
        <Separator />
        <Item onClick={this.handleMenuClick} data={{ item: 'Repeatable' }}>Make repeatable</Item>
        <Item onClick={this.handleMenuClick} data={{ item: 'AddToBounding' }}>Add to bounding container</Item>
        <Item onClick={this.handleMenuClick} data={{ item: 'SendToBack' }}>Send To Back</Item>
      </Menu>
    </div>);
  }
};

String.prototype.toLowerCaseFirst = function LowerCaseFirst() {
  return this[0].toLowerCase() + this.slice(1);
}

export default ResizeDemo;
// render(<ResizeDemo />, document.getElementById('root'));
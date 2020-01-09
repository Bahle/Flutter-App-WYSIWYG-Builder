import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';
import { Widget } from './enums';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import { setGlobalShapesByShape } from './GlobalState';

const fillStyle = {width: '100%', height: '100%'};
const borderedContainerStyle = {display:'flex', justifyContent:'center', alignItems:'center', border: 'dashed 2px silver'}

const Demo = (props/*: DemoProps*/) => {
  const { getRef, id, key, type, x, y, angle, width, height, externalSetFocus, isFocused, stageId, widgetProps = {} } = props // focused should be inherited from parent general widget
  const [focused, setFocused] = React.useState((() => { console.log('Demo init being called'); return false; })() || false);
  const [widgetType, setWidgetType] = React.useState(type);
  // const [getWidgetProps, setWidgetProps] = React.useState(widgetProps);

  // alert('what teh fuck is props: ' + JSON.stringify(props));

  const doIt = text => {
    alert('doing it?')
    // setWidgetProps(text);
  }

  let elem = null;

  /*const setWidgetProps = function(text) {
    // this.setState({widgetProps: text})
    setWidgetProps(text)
  }*/

  /*React.useEffect(() => {
      console.clear();
      console.log('useEffect has been called!');
      switch(type) {
        case Widget.RaisedButton: elem = <Button variant="contained" style={fillStyle}>Default</Button>; alert('Raised'); console.dir(elem); break;
        case Widget.FlatButton: elem = <Button style={fillStyle}>Default</Button>; alert('Flat'); break;
        case Widget.OutlineButton: elem = <Button variant="outlined" style={fillStyle}>Default</Button>; alert('Outline'); break;
        default: elem = <div>null</div>;
      }
  },type); //Pass Array as second argument*/

  return (
    <div
      onBlur={() => { setFocused(false); /*window.localStorage.removeItem('currentSelection');*/ }}
      onFocus={() => { setFocused(true); }} 
      onMouseDown={() => { 
        let shape = {x, y, width, height, id, type, stageId, key, widgetProps};
        window.localStorage.setItem('currentSelection', JSON.stringify(shape)); /*console.log( x, y, width, height);*/ 
        setGlobalShapesByShape(shape);
      }}
      onMouseUp={() => {
        // let shape = {x, y, width, height, id, type, stageId, key};
        // window.localStorage.setItem('currentSelection', JSON.stringify(shape)); /*console.log( x, y, width, height);*/ 
        // setGlobalShapesByShape(shape);
      }}

      style={{
        position: 'relative',
        left: x,
        top: y,
        width: width,
        height: height,
        transform: `rotate(${angle}deg)`,
        border: `${/*isFocused*/focused ? '3px' : '0'} solid black`,
        boxSizing: "border-box"
      }}
      className='widget'
      ref={getRef}
    >
      {
        (() => {
          // if(false) return <div>Look at me</div>; else return <div>Check me out</div>
          switch(type) {
            case Widget.Empty: return <div tabIndex={id} key={id} style={{...fillStyle, ...borderedContainerStyle}}>...</div>; break;
            case Widget.RaisedButton: return <Button variant="contained" style={fillStyle}>{ widgetProps.text || 'Default' } </Button>; break;
            case Widget.FlatButton: return <Button style={fillStyle}>Default</Button>; break;
            case Widget.OutlineButton: return <Button variant="outlined" style={fillStyle}>Default</Button>; break;
            case Widget.Image: return <div style={{...fillStyle, ...borderedContainerStyle}}><ImageIcon color="action" /></div>; break;
            case Widget.Text: return <Typography tabIndex={id} style={{...fillStyle, ...borderedContainerStyle}}>{ widgetProps.text || '...' }</Typography>; break;
            default: return <Box component="chip" m={1}>Could not find widget</Box>;
          }
        })()
      }
    </div>
  )
}

Demo.defaultProps = {
  x: 0,
  y: 0,
  width: 200,
  height: 200,
  angle: 0
}

export default Demo

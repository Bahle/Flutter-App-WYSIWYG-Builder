import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import PasswordField from './components/PasswordField';
import { Widget } from './enums';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { setGlobalShapesByShape } from './GlobalState';
import { Typography, Card, Box, Button, TextField, Grid, AccountCircle, InputAdornment, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemIcon, ListItemSecondaryAction,
         CardActionArea, CardActions, CardContent, CardMedia, IconButton, CardHeader, Paper } from '@material-ui/core';
import './Demo.css'


const MaterialIcons = require('@material-ui/icons')

const fillStyle = {width: '100%', height: '100%'};
const borderedContainerStyle = {display:'flex', justifyContent:'center', alignItems:'center', border: 'dashed 2px silver'}
const imageStyle = {width: '100%', height: '100%'}

const Demo = (props/*: DemoProps*/) => {
  const { getRef, id, key, type, x, y, angle, width, height, externalSetFocus, isFocused, stageId, widgetProps = {} } = props // focused should be inherited from parent general widget
  const [focused, setFocused] = React.useState((() => { console.log('Demo init being called'); return false; })() || false);
  const [widgetType, setWidgetType] = React.useState(type);
  
  const doIt = text => {
    alert('doing it?')
    // setWidgetProps(text);
  }

  let elem = null;

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
        <div style={{...fillStyle, ...borderedContainerStyle}}>
        {(() => {
          // if(false) return <div>Look at me</div>; else return <div>Check me out</div>
          switch(type) {
            case Widget.Empty: return <div tabIndex={id} key={id} style={{...fillStyle}}>...</div>; break;
            case Widget.RaisedButton: return <Button variant="contained" style={fillStyle}>{ widgetProps.text || 'Default' } </Button>; break;
            case Widget.FlatButton: return <Button style={fillStyle}>Default</Button>; break;
            case Widget.OutlineButton: return <Button variant="outlined" style={fillStyle}>Default</Button>; break;
            case Widget.Image: return <div style={{...fillStyle}}>
              {
                widgetProps.image ? (!widgetProps.stretchMode || widgetProps.stretchMode == 'Stretch' ? <img src={widgetProps.image} style={imageStyle} /> : <div style={{...imageStyle, backgroundImage: `url(${widgetProps.image})`, backgroundSize: widgetProps.stretchMode}}></div>) : <ImageIcon color="action" />
              }
              </div>;
            break;
            case Widget.Text: return <Typography tabIndex={id} style={{...fillStyle}}>{ widgetProps.text || '...' }</Typography>; break;
            case Widget.TextField: {
              // dat, number and time lia sokolisa hence generalized them
              if(!widgetProps.type || widgetProps.type != 'Password') { return (
                  <TextField 
                    placeholder={widgetProps.placeholder || ''}
                    label={widgetProps.label || ''}
                    value={widgetProps.text}
                    style={{...fillStyle}}
                    InputProps={{
                      readOnly: true,
                      startAdornment: !widgetProps.leadingIcon ? null : (
                        <InputAdornment position="start">
                          { React.createElement( MaterialIcons[widgetProps.leadingIcon] ) }
                        </InputAdornment>
                      ),
                      endAdornment: !widgetProps.trailingIcon ? null : (
                        <InputAdornment position="end">
                          { React.createElement( MaterialIcons[widgetProps.trailingIcon] ) }
                        </InputAdornment>
                      ),
                    }} />
              ); break; }
              if(widgetProps.type == 'Password') { return <div style={{...borderedContainerStyle, display: 'block', ...fillStyle}}><PasswordField placeholder={widgetProps.placeholder || ''} label={widgetProps.label || ''} value={widgetProps.text} /></div>; break; }
            }
            case Widget.ListTile: return (
              <List style={{...fillStyle, justifyContent: 'left'}}>
                <ListItem>
                    {
                      // React.createElement(widgetProps.isAvatarLeading ? 'Avatar' : 'div', {}, [MaterialIcons[widgetProps.leadingIcon]] )
                      (function() {
                        if( widgetProps.leadingIcon ) {
                          if( widgetProps.isAvatarLeading ) {
                            return (<ListItemAvatar><Avatar>
                              { React.createElement( MaterialIcons[widgetProps.leadingIcon] ) }
                            </Avatar></ListItemAvatar>)
                          } else {
                            return (<ListItemIcon>
                              { React.createElement( MaterialIcons[widgetProps.leadingIcon] ) }
                            </ListItemIcon>)
                          }
                        }
                      })()
                    }

                    { widgetProps.leadingImage && <ListItemAvatar><Avatar src={widgetProps.leadingImage} /></ListItemAvatar> }                    
                  <ListItemText primary={widgetProps.title} secondary={widgetProps.subtitle} />
                  <ListItemSecondaryAction>
                    <ListItemIcon edge="end">
                      { widgetProps.trailingIcon && React.createElement( MaterialIcons[widgetProps.trailingIcon] ) }
                    </ListItemIcon>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            );
            case Widget.Card: return(
              <Card style={{textAlign: 'left'}}>
                <CardHeader
                  avatar={
                    <Avatar src={widgetProps.avatar} />
                  }
                  action={
                    <IconButton aria-label="settings">
                      { MaterialIcons[widgetProps.headerAction] }
                    </IconButton>
                  }
                  title={widgetProps.title || "Title"}
                  subheader={widgetProps.subtitle || "Subtitle"}
                />
                { widgetProps.mediaHeight === undefined || widgetProps.mediaHeight == 'auto' ?
                   <img width="100%" src={widgetProps.image || '/BlankImage.png'} /> :
                   <CardMedia
                     image="./0/file-1578598603929.PNG"
                     title="Paella dish"
                     style={{height: '110px'}}
                   />
                }

                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p">
                    { widgetProps.text || 'Content...' }
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  {
                    widgetProps.actions && widgetProps.actions.map(action => (
                      <IconButton>
                        { MaterialIcons[action] }
                      </IconButton>
                    ))
                  }
                </CardActions>
              </Card>
            )
            case Widget.Paper: return <Paper elevation={widgetProps.elevation || 1} style={fillStyle} />
            default: return <Box component="chip" m={1}>Could not find widget</Box>;
          }
        })()}
        </div>
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

import * as React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import PasswordField from './components/PasswordField';
import { Widget } from './enums';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { setGlobalShapesByShape, getShapeWidgetProps, setShapeWidgetProps } from './GlobalState';
import { Typography, Card, Box, Button, TextField, Grid, InputAdornment, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemIcon, ListItemSecondaryAction,
         CardActionArea, CardActions, CardContent, CardMedia, IconButton, CardHeader, Paper, AppBar, Tabs, Tab, Fab, MenuItem, Menu, Radio, RadioGroup, FormControlLabel, Select, Checkbox,
         Switch, Toolbar, Drawer, Divider, Slider, LinearProgress, CircularProgress, Chip, SpeedDial } from '@material-ui/core';
import Stage from './pages/admin/interact_index';
import './Demo.css'
import { EventEmitter } from './utils/Events.js'
import { actions, materialColor } from './utils'
import SwipeableViews from 'react-swipeable-views';
import { Carousel } from 'antd'
import GoogleMapReact from 'google-map-react';
// import Cards, { Card as TinderCard } from 'react-swipe-card';
import TinderCard from 'react-tinder-card'
import MaterialDrawer from './components/MaterialDrawer'
import Rating from '@material-ui/lab/Rating';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';

// import FavoriteIcon from '@material-ui/icons/Favorite';

// import Chat from './components/Sidebar/Chat'

const MaterialIcons = require('@material-ui/icons')

const fillStyle = {width: '100%', height: '100%'};
const borderedContainerStyle = {display:'flex', justifyContent:'center', alignItems:'center', border: 'dashed 2px silver'}
const imageStyle = {width: '100%', height: '100%'}

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      tabValue: 0,
      widgetProps: getShapeWidgetProps(props), // widgetProps.text for gridItems not loading, start here
      anchorEl: null,
      drawerOpen: false
    }

    actions.forEach(action => {
      EventEmitter.subscribe(action, value => this[action](value) );
      
      this[action] = value => {
        if( window.localStorage.currentSelection && JSON.parse(window.localStorage.currentSelection).id == props.id ) { // make sure currentSelection only applies props 
          const prop = action.slice(3).toLowerCaseFirst()
          
          let { widgetProps } = this.state;
          widgetProps[prop] = value;

          // alert('props: ' + prop)
          /*if(action == 'labelColor') {
            alert('labelColor: ' + value)
          }*/

          setShapeWidgetProps(this.props, widgetProps)
          this.setState({ widgetProps });
        }
      }
    });

    EventEmitter.subscribe('makeRepeatable', this.makeRepeatable.bind(this))
    EventEmitter.subscribe('setPageHasSearch', this.setPageHasSearch.bind(this))

    // EventEmitter.subscribe('togglePageView', this.togglePageView.bind(this))
  }

  /*togglePageView(pageView) {
    const { widgetProps } = this.state;

      if(pageView == PageView.Preview) {
        if( !widgetProps.modelFields ) {

        } else if( widgetProps.model && !JSON(widgetProps.repeatable) ) {

        }
      } else if(pageView == PageView.Design) {

      }
  }*/

  makeRepeatable() {
    this.setState({widgetProps: {...this.state.widgetProps, repeatable: 'true'}})
  }

  setPageHasSearch(hasSearch) {
    // if current stageId is equal to the current page
    if(this.props.stageId == localStorage.currentPage) {
      this.pageHasSearch = hasSearch
    }
  }

  genTabProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  handleDropdownMenuShow(event) {
    this.setState({anchorEl: event.currentTarget});
  }

  handleDropdownMenuClose() {
    this.setState({anchorEl: null});
  };

  calculateWidth(type, width, widgetProps) {
    let results;
    if(type == Widget.FloatingActionButton) {
      results = widgetProps.mini != 'mini' ? 56 : 48
    } else {
      results = !(type == Widget.Text && !widgetProps.textWrap) && (type == Widget.AppBar ? '100%' : (type != Widget.GridItem && !widgetProps.inGridItem && width))
    }

    return results
  }

  calculateHeight(type, height, widgetProps) {
    let results

    if(type == Widget.FloatingActionButton) {
      results = widgetProps.mini != 'mini' ? 56 : 48
    } else {
      results = !(type == Widget.Text && !widgetProps.textWrap) && height;
    }

    return results
  }

  repeatable(Widget, widgetProps, widgetStyle) {
    // console.clear()
    // console.log('WHAT IS WIDGET: ', Widget)
    if(widgetProps.useModel) {
      return Array(10).fill(0).map(elem => {
            return <div style={{border: 'solid 2px red', height: this.props.height, position: 'relative'}}>
              <Widget style={{backgroundColor: 'red'}} />
              hello
            </div>
          })
    } else {
      return <Widget />;
    }
  }

  render() {
    const { getRef, id, key, /*type,*/ x, y, angle, width, height, externalSetFocus, isFocused, stageId/*, widgetProps = {}*/, grandParentStage } = this.props; // focused should be inherited from parent general widget
    const { widgetProps = {} } = this.state;

    const fuck = JSON.parse(window.localStorage['stage_' + stageId])[id];
    // console.log('fuck', fuck)
    let type = (fuck && fuck.type) || this.props.type; // window.localStorage[stageId] || JSON.parse(window.localStorage[stageId])[id] || 

    // damage control for freak error of no type being detected
    if(!type) type = Widget.Container;

    if(type == Widget.Text && !widgetProps.text) {
      widgetProps.text = this.props.widgetProps.text;
    }
    
    const StyledTabs = withStyles({
      root: {
        color: materialColor('OnPrimary')
      },
      indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > div': {
          display: 'none'
        },
      },
    })(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

    const WhiteIndicatorTabs = withStyles({
      root: {
        color: materialColor('OnPrimary')
      },
      indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        color: 'red',
        '& > div': {
          width: '100%',
          backgroundColor: '#ffffff',
        },
      },
    })(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

    const StyledSlider = withStyles({
      root: {
        color: materialColor('Primary'),
      },
    })(props => <Slider {...props} />);

    function TabPanel(props) {
      const { children, value, index, ...other } = props;

      return (
        <Typography
          component="div"
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          style={{height: '100%'}}
          {...other}
        >
          {value === index && <Box p={0} style={{height: '100%'}}>{children}</Box>}
        </Typography>
      );
    }

    const widgetStyle = {
        position: type != Widget.GridItem && 'absolute',
        left: x,
        top: type != Widget.AppBar ? y : 0,
        width: this.calculateWidth(type, width, widgetProps), //type != Widget.Text && (type == Widget.FAB ? 56 : (type == Widget.AppBar ? '100%' : (type != Widget.GridItem && !widgetProps.inGridItem && width))),
        height: this.calculateHeight(type, height, widgetProps),
        transform: `rotate(${widgetProps.rotation}deg)`,
        outline: `${/*isFocused*/this.state.focused ? '3px' : '0'} solid #ccc`,
        border: type != Widget.OutlineButton && widgetProps.borderWidth && `solid ${widgetProps.borderWidth}px ${materialColor(widgetProps.borderColor) || materialColor('Primary')}`,
        boxSizing: "border-box",
        borderRadius: widgetProps.borderRadius,
        color: materialColor(widgetProps.color) || materialColor('OnBackground'),
        backgroundColor: !~type.indexOf('Button') && (type != 'TextField' && type != 'Switch' && type != 'Slider' && type != 'Radio' && type != 'Checkbox' && type != 'Divider' && type != 'OutlineButton' && type != 'Chip') && materialColor(widgetProps.backgroundColor) || 'transparent',//materialColor('Background'),
        zIndex: type == Widget.AppBar && 1000,
        opacity: widgetProps.opacity !== undefined ? widgetProps.opacity : 1,
        rotation: widgetProps.rotation && `${widgetProps.rotation}deg`,
        scale: widgetProps.scale && `${widgetProps.scale}`,
        // overflow: 'hidden',
        ...(type == 'ListView' && {overflowY: 'scroll', overflowX: 'hidden'}), // widgetProps.
        ...(type == 'GridView' && {overflowY: 'scroll', overflowX: 'hidden', width: 360, left: 0}), // widgetProps.
        ...(function() {
          if(type == 'FloatingActionButton') {
            if(widgetProps.docked == 'BottomRight') {
              return {left: 280, top: 560}
            } else if(widgetProps.docked == 'BottomCenter') {
              return {left: 160, top: 560}
            } else {
              return {}
            }
          }})()
        // ...(widgetProps.type == 'GridItem' && {overflow: 'hidden', width: 360 / widgetProps.columnCount })
      }
          

    return (
      <Paper elevation={widgetProps.elevation} square={true}
        onBlur={() => { if(this.state.focused) this.setState({focused: false}) /*setFocused(false);*/ /*window.localStorage.removeItem('currentSelection');*/ }}
        onFocus={() => { if(!this.state.focused) this.setState({focused: true}) /*setFocused(true);*/ }} 
        onMouseDown={e => { 
          e.stopPropagation()
          let shape = {x, y, width, height, id, type, stageId, key, widgetProps, grandParentStage};
          // console.clear()
          // console.log('currentSelection: ' + JSON.stringify(shape))
          window.localStorage.setItem('currentSelection', JSON.stringify(shape)); /*console.log( x, y, width, height);*/ 
          // setGlobalShapesByShape(shape);
        }}
        onMouseUp={e => {
          e.stopPropagation()
          let shape = {x, y, width, height, id, type, stageId, key, widgetProps, grandParentStage};
          // console.log(`mouseUp: ${id} => x:${x}, y:${y}`)
          console.clear()
          console.log('WHAT IS shape: ', shape)
          setGlobalShapesByShape(shape);
        }}
        style={widgetStyle}
        className='widget'
        ref={getRef}
      >
        {
          <Button style={{ ...fillStyle, ...borderedContainerStyle, ...(widgetProps.innerHeight ? {height: widgetProps.innerHeight} : {}), borderRadius: widgetProps.borderRadius, padding: 0 }}> { /*type == 'Text' && 10*/ }
          {(() => {
            // if(false) return <div>Look at me</div>; else return <div>Check me out</div>
            switch(type) {
              case Widget.Container: const container = (<div className="widget-container" tabIndex={id} key={id} style={fillStyle}>
                { widgetProps.repeatable ? <Stage key={id} id={this.props.id} isContainer={true} inTabBar={true} style={{width: '100%', height: '100%'}} /> : '...'}
              </div>); return !widgetProps.inkwell ? container : <Button style={fillStyle}>{container}</Button>;
              case Widget.GridItem: return <div>{ widgetProps.children.map(childProps => { /*alert('childProps.widgetProps is: ' + JSON.stringify(childProps.widgetProps));*/ return <Demo {...childProps} widgetProps={childProps.widgetProps} /> }) }</div>;
              case Widget.RaisedButton: return (
                  <Button variant="contained" style={{ ...fillStyle, backgroundColor: materialColor(widgetProps.backgroundColor), color: materialColor(widgetProps.color) }}>
                    { widgetProps.icon && React.createElement( MaterialIcons[widgetProps.icon] ) }
                    { widgetProps.image && <img width="40" src={widgetProps.image} /> }
                    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{ widgetProps.text || 'Default' }</div>
                  </Button>)
              case Widget.FlatButton: return <Button style={{ ...fillStyle, backgroundColor: materialColor(widgetProps.backgroundColor), color: materialColor(widgetProps.color) }}>{ widgetProps.text || 'Default' }</Button>; break;
              case Widget.OutlineButton: return <Button variant="outlined" style={{ borderWidth: widgetProps.borderWidth || 2, borderColor: materialColor(widgetProps.borderColor), ...fillStyle, /*backgroundColor: materialColor(widgetProps.backgroundColor),*/ color: materialColor(widgetProps.color) }}>{ widgetProps.text || 'Default' }</Button>; break;
              case Widget.IconButton: return <IconButton style={{ ...fillStyle, backgroundColor: materialColor(widgetProps.backgroundColor), color: materialColor(widgetProps.color) }}>
                { !widgetProps.icon
                  ? '...'
                  : React.createElement( MaterialIcons[widgetProps.icon], {style: {fontSize: widgetProps.fontSize}} ) }
              </IconButton>;
              case Widget.FloatingActionButton: return (<Fab style={{ ...fillStyle, backgroundColor: materialColor(widgetProps.backgroundColor) || materialColor('Secondary'), color: materialColor(widgetProps.color) || materialColor('OnSecondary') }} variant={widgetProps.text ? 'extended' : 'round'}>
                { !widgetProps.icon && !widgetProps.text && '...'}
                { !widgetProps.icon ? '' : React.createElement( MaterialIcons[widgetProps.icon] ) }
                { widgetProps.text }
              </Fab>); break;
              case Widget.Image: return <div style={{...fillStyle}}>
                {
                  widgetProps.image ? (!widgetProps.stretchMode || widgetProps.stretchMode == 'Stretch' ? <img src={widgetProps.image} style={imageStyle} /> : <div style={{...imageStyle, backgroundImage: `url(${widgetProps.image})`, backgroundSize: widgetProps.stretchMode}}></div>) : <ImageIcon color="action" />
                }
                </div>;
              break;
              case Widget.Text:
                return this.repeatable(({style}) => <Typography tabIndex={id} variant={widgetProps.fontSize || 'body1'} style={{...fillStyle, wordWrap: 'break-word', textAlign: 'left', ...style}}>
                  { widgetProps.text || 'Nada...' }
                </Typography>, widgetProps); break;
              case Widget.TextField: {
                const StyledTextField = withStyles({
                  root: {
                    height: '100%',
                    '& > *': {
                      color: materialColor(widgetProps.color) || materialColor('OnBackground'),
                      backgroundColor: materialColor(widgetProps.backgroundColor) || 'transparent',
                      borderColor: '#f00', //materialColor(widgetProps.focusBorderColor) || materialColor('Primary'),
                      height: '100%'
                    },
                    '& > .MuiInput-underline::before': {
                      borderColor: materialColor(widgetProps.borderColor) || materialColor('OnPrimary'),
                    },
                    '& > .MuiInput-underline::after': {
                      borderColor: materialColor(widgetProps.focusBorderColor) || materialColor('Primary'),
                    },
                  }/*,
                  underline: {
                    borderColor: materialColor(widgetProps.color) || materialColor('OnBackground'),
                    '& > *': {
                      borderColor: materialColor(widgetProps.color) || materialColor('OnBackground')
                    }
                  }*/
                })(props => <TextField {...props} />);

                // dat, number and time lia sokolisa hence generalized them
                if(!widgetProps.type || widgetProps.type != 'Password') { return (
                    <div style={{display: 'flex', alignItems: 'center', width: '100%', height: '100%'}}>
                      { widgetProps.icon && React.createElement( MaterialIcons[widgetProps.icon], {style: {marginRight: 6}} ) }

                      <StyledTextField 
                        placeholder={widgetProps.placeholder || ''}
                        label={widgetProps.label || ''}
                        variant={ !widgetProps.outlinedBorder ? 'standard' : 'outlined' }
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
                      </div>
                ); break; }
                if(widgetProps.type == 'Password') { return <div style={{...borderedContainerStyle, display: 'block', ...fillStyle}}><PasswordField placeholder={widgetProps.placeholder || ''} label={widgetProps.label || ''} value={widgetProps.text} /></div>; break; }
              }
              case Widget.ListTile: return (
                <List style={{...fillStyle, justifyContent: 'left'}}>
                  <ListItem>
                    { widgetProps.leadingIcon && <ListItemIcon>{ React.createElement( MaterialIcons[widgetProps.leadingIcon] ) }</ListItemIcon> }

                    { widgetProps.leadingImage && <ListItemAvatar><Avatar src={widgetProps.leadingImage} /></ListItemAvatar> }                    
                    <ListItemText primary={widgetProps.title} secondary={widgetProps.subtitle} />
                    {
                      widgetProps.trailingIcon && <ListItemSecondaryAction>
                          <ListItemIcon edge="end">
                            { React.createElement( MaterialIcons[widgetProps.trailingIcon] ) }
                          </ListItemIcon>
                        </ListItemSecondaryAction>
                    }
                  </ListItem>
                </List>
              );
              case Widget.ListTiles: 
                var titles, subtitles, leadingIcons, trailingIcons;

                if(!widgetProps.titleModelField) {
                    titles = widgetProps.titles ? widgetProps.titles.split('\n') : [];
                    subtitles = widgetProps.subtitles ? widgetProps.subtitles.split('\n') : Array(titles.length).fill(null);
                    leadingIcons = widgetProps.leadingIcons || Array(titles.length).fill(null);
                    trailingIcons = widgetProps.trailingIcons || Array(titles.length).fill(null);
                } else {
                    const modelData = JSON.parse(window.localStorage.modelData).find(model => model.name == widgetProps.model);
                    var fieldRequires = {}

                    // get all the field names then require them same time
                    modelData.fields.forEach( field => { 
                      fieldRequires[field.fieldName] = require(`./json/${ field.dataType.replace(' ', '_').toLowerCase() }.js`)
                    });

                    // start here
                    // leading (image & letter, indexOf('/'))
                    // leading (text)
                    // next chip
                    titles = fieldRequires[widgetProps.titleModelField].default.slice(0,20);
                    // console.log('titles: ', titles)
                    subtitles = fieldRequires[widgetProps.subtitleModelField]?.default.slice(0,20) || Array(titles.length).fill('');
                    // console.log('subtitles: ', subtitles)
                    leadingIcons = fieldRequires[widgetProps.leadingModelField]?.default.slice(0,20) || Array(titles.length).fill('');
                    // console.log('leadingIcons: ', leadingIcons)
                    trailingIcons = fieldRequires[widgetProps.trailingModelField]?.default.slice(0,20) || Array(titles.length).fill('');
                    // console.log('trailingIcons: ', trailingIcons)

                    /*return <div>hello</div>*/
                }

                return <List className="list-tiles-list" style={{...fillStyle, justifyContent: 'left', overflowY: 'scroll'}}>{ titles.map((title, i) => {
                  return <ListItem key={title + i} button>
                      {
                        leadingIcons[i] &&
                          <ListItemIcon>
                            <ListItemAvatar>
                            {
                              ~leadingIcons[i].indexOf('/')
                                ? <Avatar src={leadingIcons[i]} />
                                : <Avatar>{ leadingIcons[i] }</Avatar>
                            }
                            </ListItemAvatar>
                          </ListItemIcon>
                      }
                      <ListItemText primary={title} secondary={subtitles[i]} />
                      {
                         !widgetProps.trailingCheckbox && !widgetProps.trailingSwitch && trailingIcons[i] &&
                         <ListItemSecondaryAction style={{color: 'gray', fontSize: 12}}>
                           { trailingIcons[i].slice(0,-3) }
                         </ListItemSecondaryAction>
                      }
                      { widgetProps.trailingCheckbox && <Checkbox edge="end" /> }
                      { widgetProps.trailingSwitch && <Switch edge="end" /> }
                    </ListItem>
                  })
                }
                </List>
              case Widget.Chip:
                // console.log('icons: ', widgetProps.icons)
                var labelColor = widgetProps.labelColor || 'OnBackground',
                    backgroundColor = widgetProps.backgroundColor || 'Button',
                    labels = widgetProps.labels ? widgetProps.labels.split('\n') : [],
                    icons = widgetProps.icons || Array(labels.length).fill(null),
                    images = widgetProps.images || Array(labels.length).fill(null),
                    padding = widgetProps.padding || 0,
                    fontSize = widgetProps.fontSize;

                return(
                  <div style={{...fillStyle, overflowY: 'scroll'}}>
                  {
                    labels.map((label, i) => {
                      return (
                        <Chip
                          style={{color: materialColor(labelColor), margin: 1, float: 'left', padding: `${padding+16}px ${padding}px`, borderRadius: `${padding+16}px`}}
                          label={<Typography variant={fontSize} color={labelColor.toLowerCase()} component="p">
                            { labels[i] }
                          </Typography>}
                          color={backgroundColor.toLowerCase()}
                          onDelete={widgetProps.deleteIcon && function() {}}
                          icon={icons[i] && React.createElement( MaterialIcons[icons[i]] ) }
                          avatar={images[i] && <Avatar src={'/Projects' + images[i]} />}
                          clickable={widgetProps.isSelectable}
                        />
                      )
                    })
                  }
                  </div>
              )
              case Widget.Card:
                var actionText = (widgetProps.actionText && widgetProps.actionText.split('\n')) || Array(widgetProps?.actionIcons?.length).fill('');

                return(
                  <Card style={{...fillStyle, textAlign: 'left', position: 'relative'}}>
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
                         image={widgetProps.image || '/BlankImage.png'}
                         title="Paella dish"
                         style={{width: '100%', height: `${widgetProps.mediaHeight}px`}}
                       />
                    }

                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        { widgetProps.text || 'Content...' }
                      </Typography>
                    </CardContent>
                    <CardActions style={{borderTop: 'solid thin #ececec', position: 'absolute', bottom: 0, width: '100%'}}>
                      <Grid container style={{justifyContent: 'space-around'}}>
                      {
                        widgetProps.actionIcons && widgetProps.actionIcons.map((action,i) => (
                          <Grid key={action + i} item>
                            <IconButton>
                              { React.createElement( MaterialIcons[action], {style: {color: '#999'}} ) }
                            </IconButton>
                            { actionText[i] }
                          </Grid>
                        ))
                      }
                      </Grid>
                    </CardActions>
                  </Card>
                )
              case Widget.Paper: return <Paper elevation={widgetProps.elevation || 1} style={{ ...fillStyle, color: materialColor(widgetProps.color) || 'black', backgroundColor: materialColor('Background') }} />
              case Widget.TabBar: var pages = widgetProps.tabs ? widgetProps.tabs.split('\n') : []; return (
                <div style={{width: '100%', position: 'absolute', top: 0, height: '100%', display: 'flex', flexDirection: 'column', background: materialColor('Background')}}>
                  <AppBar position="static" style={{width: '100%', backgroundColor: materialColor('Primary')}}>
                    <WhiteIndicatorTabs value={this.state.tabValue} style={{width: '100%'}} onChange={(event, newValue) => this.setState({tabValue: newValue}) /*setTabValue(newValue)*/} aria-label="simple tabs example">
                      { 
                        pages.map((page, i) => {
                          return <Tab key={i} style={{width: ((100 / pages.length) + '%')}} label={page} icon={widgetProps.tabIcons && widgetProps.tabIcons[i] && React.createElement( MaterialIcons[widgetProps.tabIcons[i]] ) } {...this.genTabProps(i)} />
                        })
                      }
                    </WhiteIndicatorTabs>
                  </AppBar>

                  {
                    pages.map((page,i) => {
                      return (<TabPanel className="widget-container" key={i} value={this.state.tabValue} index={i}>
                        <Stage key={id} id={`stage_${this.props.id}_tab${i}`} inTabBar={true} style={{width: '100%', height: '100%'}} />
                      </TabPanel>)
                    })
                  }
                </div>
              )
              case Widget.BottomNavigationBar: var pages = widgetProps.tabs.split('\n'); return (
                <div style={{width: '100%', position: 'absolute', top: 0, height: '100%', display: 'flex', flexDirection: 'column', background: materialColor('Background')}}>
                  {
                    pages.map((page,i) => {
                      return (<TabPanel className="widget-container" key={i} value={this.state.tabValue} index={i}>
                        <Stage key={id} id={`stage_${this.props.id}_tab${i}`} inTabBar={true} style={{width: '100%', height: '100%'}} />
                      </TabPanel>)
                    })
                  }

                  <AppBar position="static" style={{width: '100%', backgroundColor: materialColor('Primary')}}>
                    <StyledTabs value={this.state.tabValue} style={{width: '100%'}} onChange={(event, newValue) => this.setState({tabValue: newValue}) /*setTabValue(newValue)*/} aria-label="simple tabs example">
                      { 
                        pages.map((page, i) => {
                          return <Tab key={i} style={{width: ((100 / pages.length) + '%')}} label={page} icon={widgetProps.tabIcons && widgetProps.tabIcons[i] && React.createElement( MaterialIcons[widgetProps.tabIcons[i]] ) } {...this.genTabProps(i)} />
                        })
                      }
                    </StyledTabs>
                  </AppBar>
                </div>
              )
              case Widget.PageView: var pages = widgetProps.tabs.split('\n'); return(
                // <div style={{width: '100%', position: 'absolute', top: 0, height: '100%', display: 'flex', flexDirection: 'column'}}>
                  <SwipeableViews className="widget-container" enableMouseEvents style={{display: 'flex',...fillStyle}}>
                    {
                      pages.map((page, i) => {
                        return (<div key={i} style={{...fillStyle, border: 'solid 2px', position: 'relative'}}>
                          <Stage key={id} id={`stage_${this.props.id}_tab${i}`} inTabBar={true} style={{width: '100%', height: '100%'}} />
                        </div>)
                      })
                    }
                  </SwipeableViews>
                // </div>
              )
              case Widget.DropdownButton: var options = widgetProps.options || 'Menu item 1\nMenu item 2\nMenu item 3'; options = options.split('\n'); return(
                <div style={{...fillStyle}}>
                  <Select
                      style={{ ...fillStyle, backgroundColor: materialColor(widgetProps.backgroundColor), color: materialColor(widgetProps.color) }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={options[0]} //{this.state.dropdownValue[id]}
                      // onChange={this.handleDropdownChange.bind(this)}
                    >
                      { options.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      )) }
                    </Select>
                </div>
              )
              case Widget.PopupMenuButton: var options = widgetProps.options || 'Menu item 1\nMenu item 2\nMenu item 3'; options = options.split('\n'); return(
                <div style={{...fillStyle}}>
                  <Button style={{display: 'flex', minWidth: 0, ...fillStyle, backgroundColor: materialColor(widgetProps.backgroundColor), color: materialColor(widgetProps.color)}} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleDropdownMenuShow.bind(this)}>
                    <MoreVertIcon />
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleDropdownMenuClose.bind(this)}
                  >
                    { options.map(option => (
                      <MenuItem key={option} onClick={this.handleDropdownMenuClose.bind(this)}>{option}</MenuItem>
                    )) }
                  </Menu>
                </div>
              )
              case Widget.Radio: var options = widgetProps.options || 'Option 1\nOption 2\nOption 3'; options = options.split('\n'); var subtitles = widgetProps.subtitles ? widgetProps.subtitles.split('\n') : Array(options.length).fill(''); return (
                <div style={{...fillStyle, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                  <RadioGroup value={options[0]} name="radioGroup">
                    { options.map((option, i) => (
                      <div  key={option} className={`form-list-tile ${widgetProps.subtitles && 'subtitle'}`}>
                        <FormControlLabel value={option} control={<Radio />} label={option} />
                        { widgetProps.subtitles && <Typography className="form-list-tile-subtitle" variant="body2">{subtitles[i]}</Typography> }
                      </div>
                    )) }
                  </RadioGroup>
                </div>
              )
              case Widget.Checkbox: var options = widgetProps.options || 'Option 1\nOption 2\nOption 3'; options = options.split('\n'); var subtitles = widgetProps.subtitles ? widgetProps.subtitles.split('\n') : Array(options.length).fill(''); return (
                <div style={{...fillStyle, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                  { options.map((option, i) => (
                    <div key={option} className={`form-list-tile ${widgetProps.subtitles && 'subtitle'}`}>
                      <FormControlLabel control={<Checkbox value={option} />} label={option} />
                      { widgetProps.subtitles && <Typography className="form-list-tile-subtitle" variant="body2">{subtitles[i]}</Typography> }
                    </div>
                  )) }
                </div>
              )
              case Widget.Switch: var options = widgetProps.options || 'Option 1\nOption 2\nOption 3'; options = options.split('\n'); var subtitles = widgetProps.subtitles ? widgetProps.subtitles.split('\n') : Array(options.length).fill(''); return (
                <div style={{...fillStyle, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                  
                  { options.map((option, i) => (
                    <div key={option} className={`form-list-tile switch ${widgetProps.subtitles && 'subtitle'}`}>
                      <FormControlLabel control={<Switch value={option} />} label={option} />
                      { widgetProps.subtitles && <Typography className="form-list-tile-subtitle" variant="body2">{subtitles[i]}</Typography> }
                    </div>
                  )) }
                </div>
              )
              case Widget.DatePicker: return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog"
                      label="Date picker dialog"
                      format="dd/MM/yyyy"
                      value={new Date()}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                </MuiPickersUtilsProvider>
              )
              case Widget.TimePicker: return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Time picker"
                        value={new Date()}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                      />
                </MuiPickersUtilsProvider>
              )
              case Widget.Carousel: var pages = widgetProps.tabs.split('\n'); return(
                <Carousel style={fillStyle}>
                   {
                    pages.map((page, i) => (
                      <div key={page} style={fillStyle}>
                         <div style={{...fillStyle, backgroundImage: `url('${widgetProps.tabImages && widgetProps.tabImages[i]}')`, backgroundSize: 'cover',position:'relative'}}>
                           <h3 style={{position: 'absolute',bottom: 0,width: '100%',backgroundColor: '#0000004e',margin:0,paddingBottom:'22px',paddingTop:'10px'}}>{page}</h3>
                         </div>
                      </div>
                    ))
                  }
                 </Carousel>
              )
              case Widget.Map: return (
                <div style={{ height: '100%', width: '100%' }}>
                    <GoogleMapReact
                      style={{ height: '100%', width: '100%' }}
                      bootstrapURLKeys={{ key: 'AIzaSyAWqHa8CYTqrJ2ivvm4-VgU4v85DsrE18I' }}
                      defaultCenter={{
                        lat: 59.95,
                        lng: 30.33
                      }}
                      defaultZoom={11}
                    >
                      {/*<AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker"/>*/}
                    </GoogleMapReact>
                  </div>
              )
              case Widget.Swipe_Cards: return (<div><TinderCard flickOnSwipe={true} onCardLeftScreen={(event) => { alert('hello'); console.dir(event) }}>Hello, World!</TinderCard></div>)
              case Widget.AppBar: return (
                <MaterialDrawer leadingIcon={widgetProps.leadingIcon} title={widgetProps.title} actions={widgetProps.actions} drawerListItems={widgetProps.drawerListItems} hasSearch={this.pageHasSearch} />
              )
              case Widget.Divider: return (
                <Divider orientation={widgetProps.orientation} style={{ width: widgetProps.orientation == 'horizontal' && '100%' }} />
              )
              case Widget.Slider: return(
                <StyledSlider valueLabelDisplay={widgetProps.showLabel ? 'on' : 'off'} min={widgetProps.min} max={widgetProps.max} step={widgetProps.divisions == 0 ? 1 : Math.round((widgetProps.max - widgetProps.min) / widgetProps.divisions)} value={!widgetProps.isRangeSlider ? widgetProps.min + Math.round((widgetProps.max - widgetProps.min) * 0.3) : [widgetProps.min + Math.round((widgetProps.max - widgetProps.min) * 0.2), widgetProps.min + Math.round((widgetProps.max - widgetProps.min) * 0.8)] } />
              )
              case Widget.Progress:
                const StyledLinearProgress = withStyles({
                  root: {
                    '& > div': {
                      backgroundColor: materialColor(widgetProps.color) || materialColor('Primary')
                    },
                  },
                })(props => <LinearProgress {...props} />);

                const StyledCircularProgress = withStyles({
                  root: {
                    color: materialColor(widgetProps.color) || materialColor('Primary')
                  },
                })(props => <CircularProgress {...props} />);

                return widgetProps.type == 'Linear'
                  ? <StyledLinearProgress style={{width: '100%'}} variant={widgetProps.isDeterminate ? 'determinate' : 'indeterminate'} value={67} />
                  : <StyledCircularProgress variant={widgetProps.isDeterminate ? 'determinate' : 'indeterminate'} value={67} />
              case Widget.Rating:
                return <Rating name="read-only" value={3} readOnly />
              case Widget.ChatWindow:
                var Chat = require('./components/Sidebar/Chat').default

                return <Chat style={fillStyle} />
              case Widget.SpeedDial:
                const SpeedDialWidget = require('./components/SpeedDialWidget').default

                var actions = [
                  { icon: <FileCopyIcon />, name: 'Copy' },
                  { icon: <SaveIcon />, name: 'Save' },
                  { icon: <PrintIcon />, name: 'Print' },
                  { icon: <ShareIcon />, name: 'Share' },
                  { icon: <FavoriteIcon />, name: 'Like' },
                ];

                var icons  = widgetProps?.icons || [];
                var labels = widgetProps?.labels?.split('\n') || Array(icons.length).fill(0);
                // options = options.split('\n'); var subtitles = widgetProps.subtitles ? widgetProps.subtitles.split('\n') : Array(options.length).fill(''); return (

                /*var actions = labels.map((label,i) => {
                  return {
                    icon: icons[i],
                    name: label
                  }
                })*/

                return <SpeedDialWidget actions={actions} />
              case Widget.Placeholder:
                return <div>Placeholder</div>
              default: return <Box m={1}>Could not find widget</Box>;
            }
          })()}
          </Button>
        }
      </Paper>
    )
  }
}

Demo.defaultProps = {
  x: 0,
  y: 0,
  width: 200,
  height: 200,
  angle: 0
}

export default Demo

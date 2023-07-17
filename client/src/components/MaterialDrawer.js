import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { materialColor } from '../utils'

const MaterialIcons = require('@material-ui/icons')

const drawerWidth = 240;

const $ = window.$

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    height: '635px'
  },
  drawerPaper: {
    width: drawerWidth,
    height: '635px'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft({leadingIcon, title, actions, drawerListItems, hasSearch}) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    if(!drawerListItems) return;

    setOpen(true);
    $('.MuiDrawer-docked').show()
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setTimeout(() => $('.MuiDrawer-docked').hide(), 400)
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        style={{backgroundColor: materialColor('Primary'), position: 'relative', width: '100%'}}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
           <IconButton onClick={handleDrawerOpen} edge="start" color="inherit">{ !leadingIcon ? <MenuIcon/> : React.createElement( MaterialIcons[leadingIcon] ) }</IconButton>
           <Typography variant="h6" color="inherit">{ title || '...' }</Typography>
           
           <div style={{float:'right', position:'absolute', right:'5px'}}>
            {
              actions && actions.map(action => (
                 <IconButton key={action} color="inherit">{ React.createElement( MaterialIcons[action] ) }</IconButton>
              ))
            }

            { hasSearch && <IconButton key={'pageSearch'} color="inherit">{ React.createElement( MaterialIcons['Search'] ) }</IconButton> }
           </div>
        </Toolbar>
      </AppBar>
      { drawerListItems && <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        {/*<div style={{background: '#3f51b5',color: 'white',padding: '15px 5px'}}>
          <AccountCircleIcon fontSize="large" />
          <div style={{fontSize: '15px', textTransform: 'uppercase'}}>Name</div>
          <div style={{fontSize: '8px', textTransform: 'uppercase'}}>Email</div>
        </div>*/}
        <List>
          {drawerListItems && drawerListItems.split('\n').map((text, index) => (
            <ListItem button key={text}>
              {/*<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>*/}
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer> }
    </div>
  );
}

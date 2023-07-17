import React, { Component } from 'react';
import { Row, Col, Card, Statistic, Button, Radio, Icon, Modal, Input, Form, Select, Switch, Spin } from 'antd';
import axios from 'axios';
// import { SERVER_URL } from '../../constants';
import UserProfile from '../../UserProfile';
import '../../css/Layout.css';
import DashboardLayout from '../../layout/DashboardLayout';
import Stage from './interact_index';
import { Widget, ContainerType } from '../../enums';
import ProjectSidebar from '../../components/Sidebar/Project'
import RaisedButtonSidebar from '../../components/Sidebar/Button/RaisedButton'
import OutlineButtonSidebar from '../../components/Sidebar/Button/OutlineButton'
import FlatButtonSidebar from '../../components/Sidebar/Button/FlatButton'
import IconButtonSidebar from '../../components/Sidebar/Button/IconButton'
import FloatingActionButtonSidebar from '../../components/Sidebar/Button/FloatingActionButton'
import { ImageSidebar, ImageActions } from '../../components/Sidebar/Image'
import TextSidebar from '../../components/Sidebar/Text'
import PageSidebar from '../../components/Sidebar/Page'
import { TextFieldSidebar, TextFieldActions } from '../../components/Sidebar/TextField'
import ListTileSidebar from '../../components/Sidebar/ListTile'
import ListTilesSidebar from '../../components/Sidebar/ListTiles'
import { PaperSidebar, PaperActions } from '../../components/Sidebar/Paper'
import { TabBarSidebar } from '../../components/Sidebar/TabBar'
import { BottomNavigationBarSidebar } from '../../components/Sidebar/BottomNavigationBar'
import PageViewSidebar from '../../components/Sidebar/PageView'
import DropdownButtonSidebar from '../../components/Sidebar/Button/DropdownButton'
import PopupMenuButtonSidebar from '../../components/Sidebar/Button/PopupMenuButton'
import RadioSidebar from '../../components/Sidebar/Radio'
import CheckboxSidebar from '../../components/Sidebar/Checkbox'
import SwitchSidebar from '../../components/Sidebar/Switch'
import CarouselSidebar from '../../components/Sidebar/Carousel'
import ContainerSidebar from '../../components/Sidebar/Container'
import AppBarSidebar from '../../components/Sidebar/AppBar'
import DataModelDialog from '../../components/DataModelDialog'
import CardSidebar from '../../components/Sidebar/Card'
import DividerSidebar from '../../components/Sidebar/Divider'
import SliderSidebar from '../../components/Sidebar/Slider'
import ProgressSidebar from '../../components/Sidebar/Progress'
import ChipSidebar from '../../components/Sidebar/Chip'
import ThemeTab from '../../components/ThemeTab';
import DatePickerSidebar from '../../components/Sidebar/DatePicker'

import Page from '../../components/Page';
import NewPage from '../../components/NewPage';

import { EventEmitter } from '../../utils/Events.js'

const MODE = 'dev'

TextFieldActions.initialize();
// TextActions.initialize();
// RaisedButtonActions.initialize();
ImageActions.initialize();
// ListTileActions.initialize();
PaperActions.initialize();

const uuidv1 = require('uuid/v4');

const { Meta } = Card;
const { Option } = Select;

const $ = window.$;

const PageView = {
  Design: 'Design',
  Preview: 'Preview'
}

const NewContainerStyle = {width: 360, height: 640, display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}

// remove this mobx shit later
class Home extends Component {
  constructor(props) {
    super(props);

    let self = this;
    
    this.TextFieldActions = TextFieldActions;
    // this.TextActions = TextActions;
    // this.RaisedButtonActions = RaisedButtonActions;
    this.ImageActions = ImageActions;
    // this.ListTileActions = ListTileActions;
    this.PaperActions = PaperActions;

    // start by putting the actions up there into this class as properties
    // these are the actions for each sidebar component to be passed implementation functions
    //! ha lia fella
    ['TextField', 'Image', 'Paper'].forEach(widget => { // 'ListTile', 'Text', 'RaisedButton', 
      self[`${widget}SidebarActions`] = {}
      self[`${widget}Actions`].actions.forEach(action => {
        self[`${widget}SidebarActions`][action] = (function(e) { self[`${widget}Actions`][action](e, self.pageRef.getStageRef()) }).bind(self)
      })
    })

    // alert('b: ' + JSON.stringify(this.props.pages))

    this.state = {
      key: 'pages',
      noTitleKey: 'app',
      tool: null,
      chosenTool: 'Default',
      visible: false,
      currentTab: 'pages',
      tabs: {
        pages: this.props.pages //[] //storedPages,
        /*popups: [],
        containers: []*/
      },
      pageView: PageView.Design,
      sidebar: null,
      enabledDeletePage: false
    }
  }

  onTabChange = (key, type) => {
    // alert(key + ' ' + type);
    this.setState({ currentTab: key });
  }

  handleToolChange = e => {
    this.setState({ tool: e.target.value });
    // this.tool = e.target.value;
    window.localStorage.setItem('currentTool', e.target.value);
    // this.stageRef.hello('This is cool');
    // alert('stageRef props: ' + JSON.stringify(this.stageRef.props));
  };

  /*tabs = {
    pages: (<div>
        <Page title="Home">
          <Stage id={'a' + uuidv1()} />
        </Page>

        <Page title="Home" styling={NewContainerStyle}>
          <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} onClick={this.showModal} />
        </Page>
      </div>),
    popups: (
      <div>
        <div className="app-page">
          <Card
              hoverable
              style={NewContainerStyle}
            >
            <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} />
          </Card>
          <div className="page-title">New Popup</div>
        </div>
      </div>
    ),
    containers: (
      <div>
        <div className="app-page">
          <Card
              hoverable
              style={NewContainerStyle}
            >
            <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} />
          </Card>
          <div className="page-title">New Container</div>
        </div>
      </div>key
    )
  }*/

  tabList = [
    {
      key: 'pages',
      tab: 'Pages',
    },
    {
      key: 'models',
      tab: 'Models',
    },
    {
      key: 'colorPicker',
      tab: 'Color Picker',
    }
  ];
  
  stageRef = null;
  
  // if this fucking thing was put in the render method as is every tiny change on the page would trigger a re-render
  //? does the filter need to be optimized, or to use something else??? 
  

  componentWillMount() {
    this.shortcutKeyIndex = 0;
    this.lastShortcutKey = "";

    const self = this;
    document.addEventListener("keydown", function(e) {
      // alert(e.keyCode)
      if(e.key == "Enter") {
        if(self.state.tool != null) {
          self.setState({tool: null});
          // this.tool = null;
          window.localStorage.setItem('currentTool', null);
        }
      } else if(e.key == 'Escape') {
        self.setState({
          chosenTool: null,
          tool: null
        })

        return;
      }
      
      const shortcutKeys = {
        A: ['AppBar'],
        B: ['RaisedButton', 'FlatButton', 'OutlineButton', 'IconButton', 'FloatingActionButton', 'DropdownButton', 'PopupMenuButton'],
        C: ['Container', 'Card', 'Checkbox', 'Carousel'],
        D: ['DatePicker'],
        I: ['Image'],
        L: ['ListTile', 'ListTiles'],
        P: ['Paper'],
        R: ['Radio', 'Rating'],
        S: ['Slider', 'Switch'],
        T: ['Text', 'TextField', 'TabBar', 'TimePicker']
      }

      if(!window.localStorage.currentSelection) {
        const key = e.key.toUpperCase();
        if(self.lastShortcutKey.toUpperCase() == key) {
          self.shortcutKeyIndex++;
        } else {
          self.shortcutKeyIndex = 0;
        }
        
        // console.log(shortcutKeys[key] && shortcutKeys[key][ (self.shortcutKeyIndex) % shortcutKeys[key].length ])
        const chosenTool = shortcutKeys[key] && shortcutKeys[key][(self.shortcutKeyIndex) % shortcutKeys[key].length]; // e.g. 8 % 7 = 1

        self.setState({
          chosenTool,
          tool: 'rectangle'
        })

        window.localStorage.chosenTool = chosenTool;
        window.localStorage.currentTool = 'rectangle';
        self.lastShortcutKey = key
      }
    });

    // ===========================
    const projectId = window.location.pathname.split("/")[2];
    window.localStorage.currentProject = projectId;

    if(MODE == 'dev') {
      // initialize pages if not defined
      // if(!window.localStorage.pages) window.localStorage.pages = "[]";
      if(!window.localStorage.dataModels) window.localStorage.dataModels = "[]";
    }

    window.localStorage.movedShapes = "{}";

    // regardless of development mode
    /*const colourDataSource = [
      { key: 'Primary', name: 'Primary', materialColor: 'blue500', colorCode: '#2196f3' },
      { key: 'PrimaryVariant', name: 'Primary Variant', materialColor: 'white', colorCode: '#ffffff' },
      { key: 'Secondary', name: 'Secondary', materialColor: 'pinkA400', colorCode: '#f50057' },
      { key: 'SecondaryVariant', name: 'Secondary Variant', materialColor: 'white', colorCode: '#ffffff' },
      { key: 'Background', name: 'Background', materialColor: 'white', colorCode: '#ffffff' },
      { key: 'Button', name: 'Button', materialColor: 'grey300', colorCode: '#e0e0e0' },
      { key: 'Surface', name: 'Surface', materialColor: 'white', colorCode: '#ffffff' },
      { key: 'Error', name: 'Error', materialColor: 'red700', colorCode: '#d32f2f' },
      { key: 'OnPrimary', name: 'On Primary', materialColor: 'white', colorCode: '#ffffff' },
      { key: 'OnSecondary', name: 'On Secondary', materialColor: 'black', colorCode: '#000000' },
      { key: 'OnBackground', name: 'On Background', materialColor: 'black', colorCode: '#000000' },
      { key: 'OnSurface', name: 'On Surface', materialColor: 'black', colorCode: '#000000' },
      { key: 'OnError', name: 'On Error', materialColor: 'white', colorCode: '#ffffff' },
    ];

    if(!window.localStorage.themeData) window.localStorage.themeData = "{\"color\":" + JSON.stringify(colourDataSource) + ",\"typography\":{},\"icons\":\"\"}";*/

    /*let project = window.location.pathname.split('/');
    // alert('project: ' + project);
    project = project[project.length-1];*/

    //? window.localStorage.pages = "[]"; //?

    /*
    always runs regardless of whether in view
    if(window.location.pathname == "/") {
      alert('GIMME GIMME GIMME GIMME GIMME');
    }*/
    // const storedPages = JSON.parse(window.localStorage.pages);

    window.localStorage.setItem('currentTool', null);

    window.localStorage.pageView = PageView.Design;
    // ===========================

    // not working
    /*window.addEventListener('storage', () => {
      alert('localStorage changed');
    });*/
  }

  GetPageProps(properties) {
    // alert(JSON.stringify(properties))
    let tabs = Object.assign({}, this.state.tabs);
    // add the new page with props
    const key = 'p' + uuidv1();
    const newPage = {
      type: properties.type,
      name: properties.title,
      id: `stage_${key}`,
      key: key,
      height: 640
    }
    // alert('new page is: ' + JSON.stringify(properties))
    tabs.pages.push(newPage);

    const pages = JSON.parse(window.localStorage.pages);
    pages.push(newPage);
    window.localStorage.pages = JSON.stringify(pages);
    // alert('window.localStorage.pages is now ' + window.localStorage.pages)

    // set the selected page as the newly created one
    window.localStorage.currentPage = key;

    let project = window.location.pathname.split('/');
        project = project[project.length-1]

    // alert('happening')
    axios
      .post('http://localhost:5000/project/page', {
        id: project,
        page: newPage
      })
      .then(response => {
        alert('received response: ' + response.data)
        if(response.data == 'success') {
          window.location = window.location;
        } else {
          alert('received response: ' + response.data)
        }
      })
      .catch(err => alert(`Error occured: ${err}`))

    /** this.setState({tabs}) don't really need this
    this.fuckfuck = this.state.tabs.pages.map(page => {
      return (<Page title={page.name} type={page.type} styling={NewContainerStyle} id={page.id} key={page.id} ref={page => this.pageRef = page}>
        <Stage ref={(stage) => {alert('stageRef'); this.stageRef = stage}} key={page.name} id={page.name} />
      </Page>
      )}
    )*/

    // window.localStorage[newPage.id] = newPage;
    /*for(const page in pages) {
      if(page.indexOf('stage') !== -1) {

      }
    }*/
  }

  RaisedButtonSidebarRef = null;

  handleDeletePage() {
    if(!window.confirm('Are you sure you want to delete this page')) return;

    const type = 'pages'; // should be a parameter

    const currentPageName = window.localStorage.currentPage;
    let newPages = JSON.parse(window.localStorage.pages);
    window.localStorage.pages = JSON.stringify(newPages.filter(page => page.name != currentPageName));

    alert('current page: ' + currentPageName)
    delete window.localStorage['stage_' + currentPageName]; // newPages.find(page => page.key == currentPageId).name
    window.localStorage.removeItem('stage_' + currentPageName); // newPages.find(page => page.key == currentPageId).name

    /*const project = req.body.id,
      pageName = req.body.name;*/

    let project = window.location.pathname.split('/');
        project = project[project.length-1]

    axios
      .delete('http://localhost:5000/project/page', {
        data : {
          id: project,
          page: currentPageName
        }
      })
      .then(response => {
        alert('received response: ' + response.data)
        if(response.data == 'success') {
          window.location = window.location;
        } else {
          alert('received response: ' + response.data)
        }
      })
      .catch(err => console.log(`Error occured: ${err}`))

    // state not updating when remove page
    /*const newPages = this.state.tabs[type].filter(page => page.key != currentPageId);
    console.log('what is newPages: ');
    console.dir(newPages);
    
    const fuck = Object.assign({}, this.state.tabs);
    fuck[type] = newPages;

    const self = this;
    this.setState({tabs: fuck}, () => {
      console.dir(this.state.tabs);
      self.fuckfuck = this.state.tabs.pages.map(page => {
        return (<Page title={page.name} type={page.type} styling={NewContainerStyle} id={page.key} key={page.key}>
          <Stage ref={(stage) => this.stageRef = stage} key={page.name} id={page.name} />
        </Page>
        )}
      )

      console.log('what is fuckfuck');
      console.dir(self.fuckfuck)
    });*/
  }

  handleSaveChanges(exportProject=false) {
    // alert('exportProject: ' + exportProject)
    let project = window.location.pathname.split('/');
    project = project[project.length-1]

    const pageData = JSON.parse(window.localStorage.pages).map(page => ({name: page.name, data: window.localStorage['stage_' + page.name]}))

    const data = {
      id: project,
      data: {
        pages: JSON.parse(window.localStorage.pages),
        firebaseFiles: JSON.parse(window.localStorage.firebaseFiles),
        modelData: JSON.parse(window.localStorage.modelData),
        themeData: JSON.parse(window.localStorage.themeData)
      },
      pageData,
      exportProject: exportProject
    }

    // alert('sending: ', data)
    // console.dir('sending: ', data)
    
    axios
      .post('http://localhost:5000/project/fuck/', data)
      .then(response => {
        // alert('why refresh?')
      })
      .catch(err => console.log('error: ' + err))
  }

  togglePageView(checked) {
    const pageView = checked ? PageView.Preview : PageView.Design
    this.setState({pageView})

     EventEmitter.dispatch('togglePageView', pageView)
     window.localStorage.pageView = pageView;
  }

  render() {
    // alert(JSON.stringify(this.props.pages))

    if(!this.props.pages) return <div>Loading</div>;

    // console.dir('FUCK THIS SHIT: ', typeof this.state.tabs.pages)
    this.fuckfuck = this.state.tabs.pages.map(page => {
      return (<Page title={page.name} type={page.type} styling={NewContainerStyle} id={page.id} key={page.id} height={page.height} ref={page => this.pageRef = page}>
        <Stage ref={(stage) => {alert('stageRef'); this.stageRef = stage}} key={page.name} id={page.name} />
      </Page>
      )}
    )

    // alert(2)

    return (
      <DashboardLayout title='Project Name' extra={(<div>
          <div style={{position: 'absolute', right: '25px', top: '60px', zIndex: 1}}>
            <Switch
              checkedChildren={<Icon type="profile" />}
              unCheckedChildren={<Icon type="layout" />}
              defaultChecked={ this.state.pageView == PageView.Preview }
              onChange={ this.togglePageView.bind(this) }
            />
          </div>

          <div style={{marginRight: '730px', display: 'inline-block', textAlign: 'center'}}>
            <Radio.Group value={this.state.tool} onChange={this.handleToolChange}>
              {/*<Radio.Button value="text">T</Radio.Button>*/}
              <Radio.Button value="rectangle"><Icon type="border" /></Radio.Button>
              {/*<Radio.Button value="circle"><Icon type="loading-3-quarters" /></Radio.Button>*/}
            </Radio.Group>

            <small className="tool-name">{ this.state.chosenTool || 'Default' }</small>
          </div>

          <Button.Group>
              <Button disabled={!this.state.enabledDeletePage} onClick={this.handleDeletePage.bind(this)}>Delete Page</Button>
              <Button onClick={this.handleSaveChanges.bind(this)}>Save Changes</Button>
          </Button.Group>
          
          <Button onClick={this.handleSaveChanges.bind(this, true)} style={{marginLeft: 10}}>Export</Button>
          
        </div>)} tabList={this.tabList} onTabChange={this.onTabChange.bind(this)}>
        <div style={{ background: '#fff', minHeight: 380 }}>

          <Row gutter={24} onClick={() => {
            this.setState({tool: null});
            window.localStorage.setItem('currentTool', null); }
          }>
            <Col onClick={(e => {
              const $target = $(e.target)
              if( $target.closest('.widget').length > 0 ) {
                const type = JSON.parse(window.localStorage.currentSelection).type;
                
                this.setState({sidebar: type});
                if(this[`${type}SidebarRef`]) {
                  this[`${type}SidebarRef`].refreshProps();
                }

                this.setState({enabledDeletePage: true});
              } else if( $target.closest('.app-page').length > 0 ) {
                // this.setState({sidebar: 'Page'});
                this.setState({
                  sidebar: 'Page',
                  enabledDeletePage: true
                });
                window.localStorage.currentSelection = "";
              } else if( $target.closest('.widget-tab').length > 0 ) {
                // this.setState({sidebar: 'Project'});
                this.setState({
                  sidebar: 'Project',
                  enabledDeletePage: false
                });
              }

              // alert()
            }).bind(this)}
            md={19} style={{paddingLeft:'12px', paddingRight:'12px', textAlign:'center', display:'flex', justifyContent: 'center'}}>
              <div className="widget-tab" style={{ display: this.state.currentTab == 'pages' ? 'block' : 'none' }}>
                    {/*(function() { console.dir('fuckityfuck: ', this.fuckfuck) }).bind(this)() ||*/ this.fuckfuck}
                
                <NewPage GetPageProps={this.GetPageProps.bind(this)} />
              </div>
              <div ref="popups-tab" className="widget-tab" style={{ display: this.state.currentTab == 'models' ? 'block' : 'none' }}>
                <DataModelDialog />
              </div>
              <div ref="colorpicker-tab" className="widget-tab" style={{ display: this.state.currentTab == 'colorPicker' ? 'block' : 'none' }}>
                <ThemeTab />
              </div>
            </Col>
            <Col md={5} style={{paddingLeft: '12px', paddingRight: '12px', borderLeft: 'thin solid', minHeight: '700px'}}>
              {
                (function() {
                  switch(this.state.sidebar) {
                    case 'Project': return <ProjectSidebar />; break;
                    case 'Page': return <PageSidebar />; break;
                    case 'RaisedButton': return <RaisedButtonSidebar wrappedComponentRef={self => this.RaisedButtonSidebarRef = self } {...this.RaisedButtonSidebarActions } />; break;
                    case 'OutlineButton': return <OutlineButtonSidebar wrappedComponentRef={self => this.OutlineButtonSidebarRef = self } />; break;
                    case 'FlatButton': return <FlatButtonSidebar wrappedComponentRef={self => this.FlatButtonSidebarRef = self } />; break;
                    case 'IconButton': return <IconButtonSidebar wrappedComponentRef={self => this.IconButtonSidebarRef = self } />; break;
                    case 'FloatingActionButton': return <FloatingActionButtonSidebar wrappedComponentRef={self => this.FloatingActionButtonSidebarRef = self } />; break;
                    case 'Text': return <TextSidebar wrappedComponentRef={self => this.TextSidebarRef = self } {...this.TextSidebarActions } />; break;
                    case 'Image': return <ImageSidebar wrappedComponentRef={self => this.ImageSidebarRef = self } {...this.ImageSidebarActions} />; break;
                    case 'TextField': return <TextFieldSidebar wrappedComponentRef={self => this.TextFieldSidebarRef = self } {...this.TextFieldSidebarActions } />; break;
                    case 'ListTile': return <ListTileSidebar wrappedComponentRef={self => this.ListTileSidebarRef = self } {...this.ListTileSidebarActions } />; break;
                    case 'ListTiles': return <ListTilesSidebar wrappedComponentRef={self => this.ListTilesSidebarRef = self } {...this.ListTilesSidebarActions } />; break;
                    case 'Card': return <CardSidebar wrappedComponentRef={self => this.CardSidebarRef = self } {...this.CardSidebarActions } />; break;
                    case 'Paper': return <PaperSidebar wrappedComponentRef={self => this.PaperSidebarRef = self } {...this.PaperSidebarActions } />; break;
                    case 'TabBar': return <TabBarSidebar wrappedComponentRef={self => this.TabBarSidebarRef = self } />; break;
                    case 'BottomNavigationBar': return <BottomNavigationBarSidebar wrappedComponentRef={self => this.BottomNavigationBarSidebarRef = self } />; break;
                    case 'PageView': return <PageViewSidebar wrappedComponentRef={self => this.PageViewSidebarRef = self } />; break;
                    case 'DropdownButton': return <DropdownButtonSidebar wrappedComponentRef={self => this.DropdownButtonSidebarRef = self } />; break;
                    case 'PopupMenuButton': return <PopupMenuButtonSidebar wrappedComponentRef={self => this.PopupMenuButtonSidebarRef = self } />; break;
                    case 'Radio': return <RadioSidebar wrappedComponentRef={self => this.RadioSidebarRef = self } />; break;
                    case 'Checkbox': return <CheckboxSidebar wrappedComponentRef={self => this.CheckboxSidebarRef = self } />; break;
                    case 'Switch': return <SwitchSidebar wrappedComponentRef={self => this.SwitchSidebarRef = self } />; break;
                    case 'Chip': return <ChipSidebar wrappedComponentRef={self => this.ChipSidebarRef = self } />; break;
                    case 'Carousel': return <CarouselSidebar wrappedComponentRef={self => this.CarouselSidebarRef = self } />; break;
                    case 'Container': return <ContainerSidebar wrappedComponentRef={self => this.ContainerSidebarRef = self } />; break;
                    case 'AppBar': return <AppBarSidebar wrappedComponentRef={self => this.AppBarSidebarRef = self } />; break;
                    case 'Divider': return <DividerSidebar wrappedComponentRef={self => this.DividerSidebarRef = self } />; break;
                    case 'Slider': return <SliderSidebar wrappedComponentRef={self => this.SliderSidebarRef = self } />; break;
                    case 'Progress': return <ProgressSidebar wrappedComponentRef={self => this.ProgressSidebarRef = self } />; break;
                    case 'DatePicker': return <DatePickerSidebar wrappedComponentRef={self => this.DatePickerSidebarRef = self } />; break;
                    default: return <div>No item selected</div>
                  }

                  // return <div>Hello</div>
                }).bind(this)()
              }
            </Col>
          </Row>
        </div>
      </DashboardLayout>)
  }
}

class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: null
    }
  }

  componentDidMount() {
    let projectId = window.location.pathname.split('/');
    projectId = projectId[projectId.length-1]

    axios
      .get('http://localhost:5000/project?id=' + projectId)
      .then(response => {
        // return;
        // alert('Got: ' + JSON.stringify(response.data.results));
        const project = response.data.results

        // console.dir('the fucking project: ', project)

        if(project) {
          // alert('project.data.pages: ' + project.data.pages)
          window.localStorage.pages = JSON.stringify(project.data.pages);
          // alert('project.pages: ' + project.pages)
          // alert('project.data.firebaseFiles: ' + project.data.firebaseFiles);
          window.localStorage.firebaseFiles = JSON.stringify(project.data.firebaseFiles);
          // alert('project.data.modelData: ' + project.data.modelData);
          window.localStorage.modelData = JSON.stringify(project.data.modelData);
          // alert('project.data.themeData: ' + project.data.themeData);
          window.localStorage.themeData = JSON.stringify(project.data.themeData);

          // console.clear()
          // console.dir('project.pages: ', project.pages)
          // console.log('fucking pages')
          project.pages && project.pages.forEach(page => {
            if(false && page.data) { //! PLEASE REMOVE THE 'false' LATER
              // console.dir(page)
              window.localStorage['stage_' + page.name] = page.data
            }
          })

          // console.dir('JSON.parse(project.data.pages): ', JSON.parse(project.data.pages))
          /*const stuff = JSON.parse(project.data.pages).filter(page => page.type != 'TabView').map(page => (
                    <Page title={page.name} type={page.type} styling={NewContainerStyle} key={page.key} ref={page => this.pageRef = page}>
                      <Stage ref={(stage) => this.stageRef = stage} key={page.key} id={page.key} />
                    </Page>)
                  )*/

          this.setState({pages: JSON.parse(window.localStorage.pages).filter(page => page.type != 'TabView' && page.type != 'Container')})
          // alert('1: ' + )
          // console.dir('this.fuckfuck: ', this.fuckfuck)
          /*this.setState({
            tabs: { pages: project.data.pages }
          })*/
          // alert('stateo')
        } else {
          alert('No project by the id ' + project + ' could be found')
        }
      })
      // .catch(err => console.log('axios error: ' + err))
  }

  render() {
    // alert('a')

    return (
      <React.Fragment>
        {
          !this.state.pages ? <Spin /> : <Home pages={this.state.pages} />
        }
      </React.Fragment>
    )
  }
}

export default Wrapper;
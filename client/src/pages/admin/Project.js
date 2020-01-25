import React, { Component } from 'react';
import { Row, Col, Card, Statistic, Button, Radio, Icon, Modal, Input, Form, Select } from 'antd';
import axios from 'axios';
import { SERVER_URL } from '../../constants';
import UserProfile from '../../UserProfile';
import '../../css/Layout.css';
import DashboardLayout from '../../layout/DashboardLayout';
import Stage from './interact_index';
import { Widget, ContainerType } from '../../enums';
import { RaisedButtonSidebar, RaisedButtonActions } from '../../components/Sidebar/Button/RaisedButton'
import { ImageSidebar, ImageActions } from '../../components/Sidebar/Image'
import { TextSidebar, TextActions } from '../../components/Sidebar/Text'
import { PageSidebar, PageActions } from '../../components/Sidebar/Page'
import { TextFieldSidebar, TextFieldActions } from '../../components/Sidebar/TextField'
import { ListTileSidebar, ListTileActions } from '../../components/Sidebar/ListTile'
import { PaperSidebar, PaperActions } from '../../components/Sidebar/Paper'
import ProjectSidebar from '../../components/Sidebar/Project'

import {observable} from "mobx"
import {observer} from "mobx-react"

import Page from '../../components/Page';
import CreatePage from '../../components/CreatePage';

TextFieldActions.initialize();
TextActions.initialize();
RaisedButtonActions.initialize();
ImageActions.initialize();
ListTileActions.initialize();
PaperActions.initialize();

const uuidv1 = require('uuid/v4');

const { Meta } = Card;
const { Option } = Select;

const $ = window.$;

const NewContainerStyle = {height: 640, border: 'dashed 3px #ccc', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}

const projectId = window.location.pathname.split("/")[2];
window.localStorage.currentProject = projectId;

// initialize pages if not defined
if(!window.localStorage.pages) window.localStorage.pages = "[]";
if(!window.localStorage.dataModels) window.localStorage.dataModels = "[]";

const storedPages = JSON.parse(window.localStorage.pages);

window.localStorage.setItem('currentTool', null);

@observer
class Home extends Component {
  @observable sidebar = null; /* MobX managed instance state */
  @observable enabledDeletePage = false; /* MobX managed instance state */
  // @observable tool = null; /* MobX managed instance state */

  constructor(props) {
    super(props);

    let self = this;
    
    /*['TextField'].forEach(widget => {
      eval(`${widget}FieldActions`).initialize();

      this[`${widget}SidebarActions`] = {}
      eval(`${widget}FieldActions`).actions.forEach(action => {
        self[`${widget}SidebarActions`][action] = (function(e) { eval(`${widget}FieldActions`)[action](e, self.pageRef.getStageRef()) }).bind(self)
      })
    })*/

    this.TextFieldActions = TextFieldActions;
    this.TextActions = TextActions;
    this.RaisedButtonActions = RaisedButtonActions;
    this.ImageActions = ImageActions;
    this.ListTileActions = ListTileActions;
    this.PaperActions = PaperActions;

    // start by putting the actions up there into this class as properties
    ['TextField', 'Text', 'RaisedButton', 'Image', 'ListTile', 'Paper'].forEach(widget => {
      self[`${widget}SidebarActions`] = {}
      self[`${widget}Actions`].actions.forEach(action => {
        self[`${widget}SidebarActions`][action] = (function(e) { self[`${widget}Actions`][action](e, self.pageRef.getStageRef()) }).bind(self)
      })
    })

    /*this.TextFieldSidebarActions = {}
    TextFieldActions.actions.forEach(action => {
      self.TextFieldSidebarActions[action] = (function(e) { TextFieldActions[action](e, self.pageRef.getStageRef()) }).bind(self)
    })

    this.TextSidebarActions = {}
    TextActions.actions.forEach(action => {
      self.TextSidebarActions[action] = (function(e) { TextActions[action](e, self.pageRef.getStageRef()) }).bind(self)
    })

    this.RaisedButtonSidebarActions = {}
    RaisedButtonActions.actions.forEach(action => {
      self.RaisedButtonSidebarActions[action] = (function(e) { RaisedButtonActions[action](e, self.pageRef.getStageRef()) }).bind(self)
    })    

    this.ImageSidebarActions = {}
    ImageActions.actions.forEach(action => {
      self.ImageSidebarActions[action] = (function(e) { ImageActions[action](e, self.pageRef.getStageRef()) }).bind(self)
    })

    this.ListTileSidebarActions = {}
    ListTileActions.actions.forEach(action => {
      self.ListTileSidebarActions[action] = (function(e) { ListTileActions[action](e, self.pageRef.getStageRef()) }).bind(self)
    })*/
  }

  state = {
    key: 'pages',
    noTitleKey: 'app',
    tool: null,
    visible: false,
    // sidebar: null
    tabs: {
      pages: storedPages, /*[
        {
          type: ContainerType.Page.Normal,
          name: 'home',
          key: 'p' + uuidv1()
        },
        // {
        //   type: ContainerType.page,
        //   name: 'signup'
        // }
      ],*/
      popups: [
        /*{
          name: 'LogoutConfirmDialog',
          type: ContainerType.Popup.Alert
        }*/
      ],
      containers: []
    }
  }

  newPageName = ''

  onTabChange = (key, type) => {
    // alert(key + ' ' + type);
    // this.setState({ [type]: key });

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
      </div>
    )
  }*/

  tabList = [
    {
      key: 'pages',
      tab: 'pages',
    },
    {
      key: 'popups',
      tab: 'popups',
    },
    {
      key: 'containers',
      tab: 'containers',
    }
  ];
  
  stageRef = null;
  // shapeRef = null;

  /*self = this

  handleGlobalKeyDown(e) {
    console.dir(this);

    if(e.keyCode == 27) {
      if(this.state.tool != null) {
        this.setState({tool: null});
      }
    }
  }*/
  // tabs:
  // if this fucking thing was put in the render method as is every tiny change on the page would trigger a re-render
  fuckfuck = this.state.tabs.pages.map(page => (
                    <Page title={page.name} type={page.type} styling={NewContainerStyle} key={page.key} ref={page => this.pageRef = page}>
                      <Stage ref={(stage) => this.stageRef = stage} key={page.name} id={page.name} />
                    </Page>)
                  )

  componentDidMount() {
    const self = this;
    document.addEventListener("keydown", function(e) {
      // alert(e.keyCode)
      if(e.keyCode == 27) {
        if(self.state.tool != null) {
          self.setState({tool: null});
          // this.tool = null;
          window.localStorage.setItem('currentTool', null);
        }
      }
    });

    /* not working
    window.addEventListener('storage', () => {
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
    alert('new page is: ' + JSON.stringify(properties))
    tabs.pages.push(newPage);

    const pages = JSON.parse(window.localStorage.pages);
    pages.push(newPage);
    window.localStorage.pages = JSON.stringify(pages);
    alert('window.localStorage.pages is now ' + window.localStorage.pages)

    // set the selected page as the newly created one
    window.localStorage.currentPage = key;

    this.setState({tabs})
    this.fuckfuck = this.state.tabs.pages.map(page => {
      return (<Page title={page.name} type={page.type} styling={NewContainerStyle} id={page.id} key={page.id} ref={page => this.pageRef = page}>
        <Stage ref={(stage) => {alert('stageRef'); this.stageRef = stage}} key={page.name} id={page.name} />
      </Page>
      )}
    )

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

    delete window.localStorage['stage_' + currentPageName]; // newPages.find(page => page.key == currentPageId).name

    window.location = window.location;

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

  render() {
    // const { getFieldDecorator } = this.props.form;

    return (
      <DashboardLayout title='Project Name' extra={(<div>
          <Radio.Group value={this.state.tool} onChange={this.handleToolChange} style={{marginRight: '730px'}}>
            {/*<Radio.Button value="text">T</Radio.Button>*/}
            <Radio.Button value="rectangle"><Icon type="border" /></Radio.Button>
            {/*<Radio.Button value="circle"><Icon type="loading-3-quarters" /></Radio.Button>*/}
          </Radio.Group>

          <Button.Group>
              <Button disabled={!this.enabledDeletePage} onClick={this.handleDeletePage.bind(this)}>Delete Page</Button>
              <Button>Save Page</Button>
          </Button.Group>
          
        </div>)} tabList={this.tabList} onTabChange={this.onTabChange.bind(this)}>
        <div style={{ background: '#fff', minHeight: 380 }}>

          <Row gutter={24}>
            <Col onClick={(e => {
              const $target = $(e.target)
              
              if( $target.closest('.widget').length > 0 ) {
                const type = JSON.parse(window.localStorage.currentSelection).type;
                this.sidebar = type;
                if(this[`${type}SidebarRef`]) {
                  this[`${type}SidebarRef`].refreshProps();
                }

                this.enabledDeletePage = true;
              } else if( $target.closest('.app-page').length > 0 ) {
                // this.setState({sidebar: 'Page'});
                this.sidebar = 'Page';
                this.enabledDeletePage = true;
              } else if( $target.closest('.widget-tab').length > 0 ) {
                // this.setState({sidebar: 'Project'});
                this.sidebar = 'Project';
                this.enabledDeletePage = false;
              }

              // alert()
            }).bind(this)}
            md={19} style={{paddingLeft:'12px', paddingRight:'12px', textAlign:'center', display:'flex', justifyContent: 'center'}}>
              <div className="widget-tab">
                    {this.fuckfuck}
                
                <CreatePage GetPageProps={this.GetPageProps.bind(this)} />
                {/*<Page title="New Page" styling={NewContainerStyle}>
                  <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} onClick={this.showModal} />
                </Page>*/}
              </div>
              <div ref="popups-tab" className="widget-tab" style={{ display: 'none' }}>
                {
                  /*this.tabs.popups.map(popup => (
                    <Page title={popup.name} type={popup.type} styling={NewContainerStyle} key={'pa' + uuidv1()}>
                      {<Stage key={'sas' + uuidv1()} id={'sa' + uuidv1()} />}
                    </Page>)
                  )*/
                }
                <Page title="New Popup" styling={NewContainerStyle}>
                  <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} onClick={this.showModal} />
                </Page>
              </div>
              {/*<div ref="containers-tab" className="widget-tab" style={ this.state.key != 'containers' ? { display: 'none' } : {} }>
                {
                  this.tabs.containers.map(container => (
                    <Page title={container.name} type={container.type} styling={NewContainerStyle} key={'pd' + uuidv1()}>
                      <Stage id={'sd' + uuidv1()} />
                    </Page>)
                  )
                }
                <Page title="New Container" styling={NewContainerStyle}>
                  <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} onClick={this.showModal} />
                </Page>
              </div>*/}

            </Col>
            <Col md={5} style={{paddingLeft: '12px', paddingRight: '12px', borderLeft: 'thin solid', minHeight: '700px'}}>
              {
                (function() {
                  switch(this.sidebar) {
                    case 'Project': return <ProjectSidebar  />; break;
                    case 'Page': return <PageSidebar setHeight={(function(e) { PageActions.setHeight(e, this.pageRef) }).bind(this)}/>; break;
                    case 'RaisedButton': return <RaisedButtonSidebar wrappedComponentRef={self => this.RaisedButtonSidebarRef = self } {...this.RaisedButtonSidebarActions } />; break;
                    case 'Text': return <TextSidebar wrappedComponentRef={self => this.TextSidebarRef = self } {...this.TextSidebarActions } />; break;
                    case 'Image': return <ImageSidebar wrappedComponentRef={self => this.ImageSidebarRef = self } {...this.ImageSidebarActions} />; break;
                    case 'TextField': return <TextFieldSidebar wrappedComponentRef={self => this.TextFieldSidebarRef = self } {...this.TextFieldSidebarActions } />; break;
                    case 'ListTile': return <ListTileSidebar wrappedComponentRef={self => this.ListTileSidebarRef = self } {...this.ListTileSidebarActions } />; break;
                    case 'Paper': return <PaperSidebar wrappedComponentRef={self => this.PaperSidebarRef = self } {...this.PaperSidebarActions } />; break;
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

/*@observer
class Fuck extends React.Component {
  render() {
    return(
      <div>
      {
        (function() {
          switch(this.props.sidebar) {
            case 'RaisedButton': return <RaisedButtonSidebar setText={(function(e) { RaisedButtonActions.setText(e, this.props.stage) }).bind(this)} />; break;
            case 'Page': return <PageSidebar />; break;
            case 'Project': return <ProjectSidebar  />; break;
            default: return <div>No item selected</div>
          }

          // return <div>Hello</div>
        }).bind(this)()
      }
      </div>
    )
  }
}*/

export default Home;
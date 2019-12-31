import React, { Component } from 'react';
import { Row, Col, Card, Statistic, Button, Radio, Icon, Modal, Input } from 'antd';
import axios from 'axios';
import { SERVER_URL } from '../../constants';
import UserProfile from '../../UserProfile';
import '../../css/Layout.css';
import DashboardLayout from '../../layout/DashboardLayout';
import Stage from './interact_index';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from 'react-contextmenu'
import { Widget } from '../../enums';
import RaisedButtonSidebar from '../../components/Sidebar/Button/RaisedButton'
import PageSidebar from '../../components/Sidebar/Page'
import ProjectSidebar from '../../components/Sidebar/Project'

import {observable} from "mobx"
import {observer} from "mobx-react"

const uuidv1 = require('uuid/v4');

const { Meta } = Card;

const $ = window.$;

const Page = ({title, height = 640, styling, children}) => {
  return (
    <div className="app-page">
      <Card
          hoverable
          style={styling}
        >
        {/*<Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} onClick={this.showModal} />*/}
        {children}
      </Card>
      <div className="page-title">{title}</div>
    </div>
  );
}

const ContainerType = {
  Page: 1,
  Popup: {
    Dialog: 2,
    Drawer:  3,
    BottomSheet: 4,
    // Snackbar: 5,
    Tooltip: 6,
    DatePicker: 7,
  },
  container: {
    TabView: 8,
    PageView: 9,
    IndexedStack: 10,
    Stepper: 11,
    ExpansionPanel: 12,
    Form: 13
  }
}

const NewContainerStyle = {height: 640, border: 'dashed 3px #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center'}

@observer
class Home extends Component {
  @observable selection = null; /* MobX managed instance state */

  state = {
    key: 'pages',
    noTitleKey: 'app',
    tool: null,
    visible: false,
    sidebar: null
  }

  newPageName = ''

  onTabChange = (key, type) => {
    // alert(key + ' ' + type);
    this.setState({ [type]: key });

  }

  handleToolChange = e => {
    this.setState({ tool: e.target.value });
    window.localStorage.setItem('currentTool', e.target.value);
  };


  showModal = () => {
    // alert('happeneing')
    this.setState({
      visible: true,
    });
  };

  handleModalOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleModalCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  tabs = {
    pages: [
      {
        type: ContainerType.page,
        name: 'home'
      },
      /*{
        type: ContainerType.page,
        name: 'signup'
      }*/
    ],
    popups: [
      /*{
        name: 'LogoutConfirmDialog',
        type: ContainerType.Popup.Alert
      }*/
    ],
    containers: []
  }

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
  componentDidMount() {
    window.localStorage.setItem('currentTool', 'rectangle');

    const self = this;
    document.addEventListener("keydown", function(e) {
      if(e.keyCode == 27) {
        if(self.state.tool != null) {
          self.setState({tool: null});
          window.localStorage.setItem('currentTool', null);
        }
      }
    });
  }

  /*shouldComponentUpdate(nextProps, nextState) {
      console.log('shouldComponentUpdate fuckCKCKJDKFJDSKFJSDKFJ')
      console.log(nextState)
      console.log(this.state)
      console.log(this.state == nextState)
      // if(nextState == this.state) return false;
      // console.dir(nextState);
      // console.dir(nextState);

      return true;
      // return this.init;

    }*/

    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps fuckCKCKJDKFJDSKFJSDKFJ')

        /*if (nextProps.inputValue !== this.props.inputValue) {
          this.setState({ inputVal: nextProps.inputValue })
        }*/
      }

  render() {
    return (
      <DashboardLayout title='Project Name' extra={(<div>
          <Radio.Group value={this.state.tool} onChange={this.handleToolChange} style={{marginRight: '730px'}}>
          <Radio.Button value="text">T</Radio.Button>
            <Radio.Button value="rectangle"><Icon type="border" /></Radio.Button>
            <Radio.Button value="circle"><Icon type="loading-3-quarters" /></Radio.Button>
          </Radio.Group>
        </div>)} tabList={this.tabList} onTabChange={this.onTabChange.bind(this)}>
        <div style={{ background: '#fff', minHeight: 380 }}>
          <Modal
            key="modalKey"
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleModalOk}
            onCancel={this.handleModalCancel}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>

          <Row gutter={24}>
            <Col onClick={(e => {
              const $target = $(e.target)
              if( $target.closest('.widget').length > 0 ) {
                // this.setState({sidebar: 'RaisedButton'});
                this.sidebar = 'RaisedButton';
              } else if( $target.closest('.app-page').length > 0 ) {
                // this.setState({sidebar: 'Page'});
                this.sidebar = 'Page';
              } else if( $target.closest('.widget-tab').length > 0 ) {
                // this.setState({sidebar: 'Project'});
                this.sidebar = 'Project';
              }
            }).bind(this)}
            md={19} style={{paddingLeft:'12px', paddingRight:'12px', textAlign:'center', display:'flex', justifyContent: 'center'}}>
              <div ref="pages-tab" className="widget-tab" style={ this.state.key != 'pages' ? { display: 'none' } : {} }>
                {
                  this.tabs.pages.map(page => (
                    <Page title={page.name} type={page.type} styling={NewContainerStyle} key={'p' + uuidv1()}>
                      <Stage key={page.name} id={page.name} />
                    </Page>)
                  )
                }
                <Page title="New Page" styling={NewContainerStyle}>
                  <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} onClick={this.showModal} />
                </Page>
              </div>
              <div ref="popups-tab" className="widget-tab" style={ this.state.key != 'popups' ? { display: 'none' } : {} }>
                {
                  this.tabs.popups.map(popup => (
                    <Page title={popup.name} type={popup.type} styling={NewContainerStyle} key={'pa' + uuidv1()}>
                      {/*<Stage key={'sas' + uuidv1()} id={'sa' + uuidv1()} />*/}
                    </Page>)
                  )
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
                  switch(this.state.sidebar) {
                    case 'RaisedButton': return <RaisedButtonSidebar />; break;
                    case 'Page': return <PageSidebar />; break;
                    case 'Project': return <ProjectSidebar />; break;
                    default: return <div>No item selected</div>
                  }

                  return <div>Hello</div>
                }).bind(this)()
              }
            </Col>
          </Row>
        </div>
      </DashboardLayout>)
  }
}

export default Home;
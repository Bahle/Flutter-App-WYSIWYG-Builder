import React from 'react'
import { Tabs, Button, Input, Select, Popconfirm, Collapse, Radio, Row, Col, Tag, Empty } from 'antd';
import EditableTableMethods from './EditableTableMethods'
import EditableTableFields from './EditableTableFields'
import SingleFileUpload from './SingleFileUpload'
import Draggable from 'react-draggable'
// import ResizableAndMovable from 'react-resizable-and-movable' // not fucking working!

/*if(!window.localStorage.hostServers) */window.localStorage.hostServers = '{}'; // reinit
/*if(!window.localStorage.firebaseFiles) */window.localStorage.firebaseFiles = '{}'; // reinit

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;
const { Panel } = Collapse;

const $ = window.$

const containerStyle = {
  background: 'white',
  height: '50%',
  overflowY: 'scroll',
  borderBottom: 'solid thin #999'
}

const fieldSampleValues = [{
  key: '0',
  fieldName: 'Edward King 0',
  requestType: '32'
},
{
  key: '1',
  fieldName: 'Edward King 1',
  requestType: '32'
}]

const methodSampleValues = [{
  key: '0',
  methodName: 'Edward King 0',
  requestType: '32',
  endPoint: 'London, Park Lane no. 0',
  dataType: 'Cool'
},
{
  key: '1',
  methodName: 'Edward King 1',
  requestType: '32',
  endPoint: 'London, Park Lane no. 1',
  dataType: 'stuff'
}]

const PillStyle = {
  width: '300px',
  margin: '2px 0',
  padding: '5px 12px',
  fontSize: '15px',
  display: 'block'
}

const EmptyPanes = () => (
  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
)

const TabContent = React.forwardRef(({tabKey, tabName, tabMethods, tabFields, tabHostServer, tabFirebaseFile, tabType, reqType = 'rest', addTab}, ref) => {
  // alert( `reqType: ${JSON.stringify(reqType)}`)
  const [modelType, setModelType] = React.useState('null')
  const [modelFields, setModelFields] = React.useState([])
  const [hostServer, setHostServer] = React.useState(tabHostServer)
  const [firebaseFile, setFirebaseFile] = React.useState(tabFirebaseFile)
  
  const modelTypeFields = JSON.parse(window.localStorage.modelTypes);

  const handleModelTypeChange = value => {
    setModelType(value)
  }

  const handleFirebaseFileChange = value => {
    const firebaseFiles = JSON.parse(window.localStorage.firebaseFiles);
    firebaseFiles[tabKey] = value;
    window.localStorage.firebaseFiles = JSON.stringify(firebaseFiles)
    setFirebaseFile(value);
  }

  const handleHostServerChange = e => {
    const hostServers = JSON.parse(window.localStorage.hostServers);
    hostServers[tabKey] = e.target.value;
    window.localStorage.hostServers = JSON.stringify(hostServers)
    setHostServer(e.target.value)
  }

  return (
    <Row>
      <Col xs={24} md={18}>
        <div style={{maxWidth: '1000px'}}>
          {
            tabType ==  'method'
              ? <EditableTableMethods Value={tabMethods} ref={ref} TabName={tabName} Values={[]} ModelType={modelType} AddTab={addTab} /> 
              : <EditableTableFields Value={tabFields} ref={ref} TabName={tabName} Values={[]} ModelType={modelType} AddTab={addTab} />
          }
        </div>
      </Col>
      <Col xs={24} md={6}>
        {
          (function() {
            if(tabType == 'method') {
              return (
                reqType == 'firebase' ? 
                  <div>
                    <SingleFileUpload value={firebaseFile} onChange={handleFirebaseFileChange} />
                    <div>Firebase JSON File</div>
                  </div>
                :
                  <div>
                    <div>Host Server</div>
                    <Input value={hostServer} placeholder="http://www.server.com" onChange={handleHostServerChange} />
                  </div>
              )
            } else {
              return (
                <div>
                  <Select defaultValue="null" style={{width: '100%', marginBottom: '7px'}} onChange={handleModelTypeChange}>
                    <Option value="null">-- Select --</Option>
                    <Option value="post">Post/Item</Option>
                    <Option value="product">Product</Option>
                    <Option value="service">Service</Option>
                    <Option value="user">User</Option>
                    <Option value="business">Business</Option>
                    <Option value="house">House</Option>
                    <Option value="payment">Payment</Option>
                    <Option value="order">Order</Option>
                    <Option value="call">Call</Option>
                    <Option value="category">Category</Option>
                    <Option value="other">Other</Option>
                  </Select>

                { /*
                 !!! later use https://github.com/bdyetton/react-resizable-and-movable for drag and drop !!!
                 !!! or https://github.com/mzabriskie/react-draggable !!!
                 !!! from https://react.rocks/tag/Drag_Drop !!!
                */ }
                  <div style={{background: 'whitesmoke', padding: '4px 7px'}}>
                    { modelTypeFields[modelType] && modelTypeFields[modelType].map(field => <Tag key={field} color="#2db7f5" style={PillStyle}>{field}</Tag>) }
                  </div>
                </div>
              )
            }
          })()

          
        }
      </Col>
    </Row>
  )
})

class DataModelDialog extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;

    const tabState = {};
    const modelData = JSON.parse(window.localStorage.modelData)

    modelData.forEach(model => {
      tabState[model.name] = {
        tabs: {
          methods: { type: model.hostServer ? 'rest' : 'firebase' },
          // fields: { type: 'rest' }
        }
      }
    })

    this.state = {
      tabState
    };

    const panes = this.props.InDialog ? [] : JSON.parse(window.localStorage.modelData).map(({name, hostServer, firebaseFile, methods, fields}) => ({ title: name, key: name, hostServer, firebaseFile, methods, fields }))

    this.methodRefs = {}
    this.fieldRefs = {}

    this.state = {
      ...this.state,
      activeKey: panes[0] && panes[0].key,
      panes,
      addingTab: !!this.props.AddingTab
    };
  }

  handleReqTypeChange(tabKey, dataType, e) {
    const { tabState } = this.state;

    tabState[tabKey].tabs[dataType].type = e.target.value

    this.setState({ tabState })
  }

  genExtra(tab, dataType) {
    return (<Radio.Group defaultValue={ tab.hostServer ? 'rest' : 'firebase' } buttonStyle="solid" onChange={this.handleReqTypeChange.bind(this, tab.key, dataType)}>
      <Radio.Button value="rest" style={{width: '78px', textAlign: 'center'}}>Rest</Radio.Button>
      <Radio.Button value="firebase">Firebase</Radio.Button>
    </Radio.Group>)
  }

onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  AddTab = (tabs = [{}]) => { // defaults to one empty object that will cause it to add a single empty tab 
    const { panes, tabState } = this.state;
    
    tabs.forEach(tab => {
      const activeKey = `newTab${this.newTabIndex++}`;
      tabState[activeKey] = {
        tabs: {
          methods: { type: tab.hostServer ? 'rest' : 'firebase' }
        }
      }

      panes.push({
        title: tab.name || this.NameInput.input.value,  
        key: activeKey,
        hostServer: tab.hostServer || '',
        firebaseFile: tab.firebaseFile || '',
        methods: tab.methods || [],
        fields: tab.fields || []
      });
    });

    this.setState({ panes, activeKey: panes[0].key, addingTab: false, tabState });
  };

  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };

  BeginEnterName = () => this.setState({addingTab: true});
  CancelEnterName = () => this.setState({addingTab: false});

  SaveModels() {
    const hostServers = JSON.parse(window.localStorage.hostServers),
          firebaseFiles = JSON.parse(window.localStorage.firebaseFiles)

    const modelData = this.state.panes.map(pane => ({
        name: pane.title,
        hostServer: hostServers[pane.key],
        firebaseFile: firebaseFiles[pane.key],
        methods: pane.methods || this.methodRefs[pane.title].state.dataSource,
        fields: pane.fields || this.fieldRefs[pane.title].state.dataSource
      })
    )

    window.localStorage.modelData = JSON.stringify(modelData)
  }

  GetModels() {
    const hostServers = JSON.parse(window.localStorage.hostServers),
          firebaseFiles = JSON.parse(window.localStorage.firebaseFiles)

    const modelData = this.state.panes.map(pane => ({
        name: pane.title,
        hostServer: hostServers[pane.key],
        firebaseFile: firebaseFiles[pane.key],
        methods: this.methodRefs[pane.title].state.dataSource,
        fields: this.fieldRefs[pane.title].state.dataSource
      })
    )

    return modelData;
  }

  componentDidMount() {
    /*$('.dude').css('height', $('body').height() - $('.dude').offset().top + 'px');
    window.onresize = function() {
      $('.dude').css('height', $('body').height() - $('.dude').offset().top + 'px');
    }*/
  }

  render() {
    return (
      !this.state ? 'loading...' :
      <div>
        <div style={{ marginBottom: 16, display: 'flex' }}>
          <div style={{position:'absolute',zIndex: 1,top: '20px',right: '7px'}}>
            {
              this.state.addingTab ? (
                <div id="tab-actions-wrapper">
                  <Input ref={input => this.NameInput = input} onPressEnter={() => this.AddTab()} placeholder="Model name" style={{width: 150}} />
                  <Button onClick={() => this.AddTab()} type="primary">Submit</Button>
                  <Button onClick={this.CancelEnterName}>Cancel</Button>
                </div>
              ) : <div>
                    <Button onClick={this.BeginEnterName} type="primary">ADD MODEL</Button> <Button style={{display: this.props.InDialog ? 'none' : 'inline' }} onClick={this.SaveModels.bind(this)} type="primary">SAVE</Button>
                  </div>
            }
          </div>
        </div>
        { !this.state.panes.length ? <EmptyPanes /> : <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          { 
            this.state.panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key} style={{padding: '0 20px'}}>
              <Collapse defaultActiveKey={['1', '2']}>
                <Panel header="Methods" key="1" extra={this.genExtra(pane, 'methods')}>
                  <TabContent
                    tabKey={pane.key}
                    tabName={pane.title}
                    tabMethods={pane.methods}
                    tabHostServer={pane.hostServer}
                    tabFirebaseFile={pane.firebaseFile}
                    ref={ref => this.methodRefs[pane.title] = ref}
                    tabType="method"
                    reqType={this.state.tabState[pane.key].tabs['methods'].type}
                    addTab={this.AddTab}
                  />
                </Panel>
                <Panel header="Fields" key="2">
                  <TabContent
                    tabKey={pane.key}
                    tabName={pane.title}
                    tabFields={pane.fields}
                    ref={ref => this.fieldRefs[pane.title] = ref}
                    tabType="field"
                    addTab={this.AddTab}
                  />
                </Panel>
              </Collapse>
            </TabPane>
          ))
        }
        </Tabs>
      }
      </div>
    );
  }
}

export default DataModelDialog
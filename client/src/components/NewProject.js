import React from 'react'
import { Button, Modal, Form, Input, Select, Card, Collapse, Checkbox, InputNumber } from 'antd';
import Page from './Page';
import './NewPage.css';
import { Widget, ContainerType } from '../enums';
import ImageDialog from './Sidebar/ImageDialog'
import { EventEmitter } from '../utils/Events.js'
import axios from 'axios'


const { Option } = Select;
const { Panel } = Collapse;

const NewContainerStyle = {height: 640, border: 'dashed 3px #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center'}

const layout = {

  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function format(value) {
  return value.length == 1 ? '0' + value : value
}

function parse(value) {
  return value.length == 2 && value[0] == '0' ? value[0] : value
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        generalPackages: ['provider', 'shared_preferences', 'flutter_launcher_icons', 'in_app_purchases', 'sqlflite', 'image_picker', 'http', 'async', 'get_it', 'dio', 'geolocation', 'google_maps'],
        minApiLevel: 0,
        ScreenSizeOrGlTextureFormat: 0,
        majorVersion: 0,
        minorVersion: 0,
        patchVersion: 0,
        versionClassifier: 'None'
      }
    }

    getImage(value) {
      this.source.input.value = value;

      EventEmitter.dispatch('setProjectIcon', value)
    }

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const essential = ['crashlytics', 'shared_preferences', 'provider', 'flutter_launcher_icons']

      return (
        <Modal
          visible={visible}
          title="Create a new project"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
          width={800}
        >
          <Form {...layout}>
            <Form.Item label="Project title">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the page title',
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Package name">
              {getFieldDecorator('package_name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the package name',
                  },
                ],
              })(<Input placeholder="e.g. com.example.project" />)}
            </Form.Item>

            <Form.Item label="Version">
              {getFieldDecorator('good', {
              })(<div>
                <Input.Group compact>
                  <Form.Item>
                    {getFieldDecorator('majorVersion', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input the major version',
                        },
                      ],
                    })(<InputNumber min={0} max={99} style={{ width: 80, textAlign: 'center' }} placeholder="Major Version" formatter={format} parse={parse} onChange={value => this.setState({majorVersion: value})} />)}
                  </Form.Item>

                  <Form.Item>
                    {getFieldDecorator('minorVersion', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input the minor version',
                        },
                      ],
                    })(<InputNumber min={0} max={99} style={{ width: 80, textAlign: 'center' }} placeholder="Minor Version" formatter={format} parse={parse} onChange={value => this.setState({minorVersion: value})} />)}
                  </Form.Item>

                  <Form.Item>
                    {getFieldDecorator('patchVersion', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input the patch version',
                        },
                      ],
                    })(<InputNumber min={0} max={99} style={{ width: 80, textAlign: 'center' }} placeholder="Patch Version" formatter={format} parse={parse} onChange={value => this.setState({patchVersion: value})} />)}
                  </Form.Item>

                  <Form.Item>
                    {getFieldDecorator('minApiLevel', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input the mininum api level',
                        },
                      ],
                    })(<InputNumber min={0} max={99} style={{ width: 80, textAlign: 'center' }} placeholder="Min Api Level" formatter={format} parse={parse} onChange={value => this.setState({minApiLevel: value})} />)}
                  </Form.Item>

                  <Form.Item>
                    {getFieldDecorator('screenSizeOrGlTextureFormat', {initialValue: 0})
                      (<InputNumber min={0} max={99} style={{ width: 80, textAlign: 'center' }} placeholder="ScreenSizeOrGlTextureFormat" formatter={format} parse={parse} onChange={value => this.setState({ScreenSizeOrGlTextureFormat: value})} />)}
                  </Form.Item>

                  <Form.Item>
                    {getFieldDecorator('versionClassifier', {
                      initialValue: this.state.versionClassifier, 
                    })
                      (<Select style={{ width: 80 }} onChange={value => this.setState({versionClassifier: value})}>
                        <Option value="none">None</Option>
                        <Option value="alpha">Alpha</Option>
                        <Option value="beta">Beta</Option>
                        <Option value="snapshot">Snapshot</Option>
                      </Select>)}
                  </Form.Item>
                  <br />
                  <div style={{marginTop: -23}}>v{this.state.majorVersion}.{this.state.minorVersion}.{this.state.patchVersion}{this.state.versionClassifier != 'None' && `-${this.state.versionClassifier}`}</div>
                </Input.Group>
              </div>)}
            </Form.Item>

            <ImageDialog>
              <Form.Item getImage={this.getImage.bind(this)} label="Icon" style={{cursor: 'pointer'}}>
                {getFieldDecorator('icon')
                  (<Input addonBefore="Choose image" placeholder='Click to select icon' ref={input => this.icon = input} />)}
              </Form.Item>
            </ImageDialog>

            <Collapse accordion defaultActiveKey={['1']}>
              <Panel header="Firebase packages" key="1">
                <Form.Item name="checkbox-group" label="Checkbox.Group">
                  {getFieldDecorator('firebasePackages')
                  (<Checkbox.Group>
                    <ul style={{ padding: '0', listStyle: 'none' }}>
                      {
                        ['crashlytics', 'auth', 'storage', 'mlkit', 'firestore', 'db', 'push', 'remote config', 'dynamic links', 'admob'].map(plugin => {
                          let disabled;
                          let checked = disabled = !!~essential.indexOf(plugin);
                          return <li key={plugin}><Checkbox checked={checked} disabled={!!~essential.indexOf(plugin)} value={plugin}>{plugin}</Checkbox></li>
                        })
                      }
                    </ul>
                  </Checkbox.Group>)}
                </Form.Item>
              </Panel>
              <Panel header="General packages" key="2">
                <Form.Item name="checkbox-group" label="Checkbox.Group">
                  {getFieldDecorator('generalPackages')
                  (<Checkbox.Group>
                    <ul style={{ padding: '0', listStyle: 'none' }}>
                      { this.state.generalPackages.map(plugin => {
                        let disabled;
                        let checked = disabled = !!~essential.indexOf(plugin);
                        return <li key={plugin}><Checkbox checked={checked} disabled={disabled} value={plugin}>{plugin}</Checkbox></li>
                      }) }
                      <li><Input ref={ref => this.newPackageRef = ref} placeholder="Another package..." onPressEnter={e => { 
                          this.setState({
                            generalPackages: [...this.state.generalPackages, e.target.value],
                            newGeneralPackage: ''
                          });

                          this.newPackageRef.input.select()                      
                      }} /></li>
                    </ul>
                  </Checkbox.Group>)}
                </Form.Item>
              </Panel>
            </Collapse>
          </Form>
        </Modal>
      );
    }
  },
);

class CollectionsPage extends React.Component {
  constructor(props) {
    super(props)

    EventEmitter.subscribe('setProjectIcon', value => this.projectIcon = value)
  }

  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      axios
        .post('/project', {
          title: form.getFieldValue('title'),
          packageName: form.getFieldValue('package'),
          firebasePackages: form.getFieldValue('firebasePackages'),
          generalPackages: form.getFieldValue('generalPackages'),
          projectIcon: this.projectIcon,
          majorVersion: form.getFieldValue('majorVersion'),
          minorVersion: form.getFieldValue('minorVersion'),
          patchVersion: form.getFieldValue('patchVersion'),
          minApiLevel: form.getFieldValue('minApiLevel'),
          screenSizeOrGlTextureFormat: form.getFieldValue('screenSizeOrGlTextureFormat'),
          versionClassifier: form.getFieldValue('versionClassifier')
        })
        .then(response => {
          console.log(JSON.stringify(response.data.results))

          if(response.data.results == 'success') {
            alert('Project written to file successfully')

            window.location = window.location
          }
        })
        .catch(err => alert('error occured: ' + err))

      // this.props.GetPageProps(values);
      /*alert('sdf')
      console.log('Received values of form: ', values);*/
      // form.resetFields();
      // this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        {/*<Button type="primary" onClick={this.showModal}>
          New Collection
        </Button>*/}
        {/*<div onClick={this.showModal}>
          <Page title="New Page" styling={NewContainerStyle}>
            <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} />
          </Page>
        </div>*/}

        <div className="app-page" onClick={this.showModal}>
          <Card
              hoverable
              style={NewContainerStyle}
            >
            <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} />
          </Card>
          <div className="page-title" style={{textAlign: 'center'}}>{this.props.title || 'New project'}</div>
        </div>

        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

// ReactDOM.render(<CollectionsPage />, mountNode);
export default CollectionsPage;
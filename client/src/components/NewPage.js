import React from 'react'
import { Button, Modal, Form, Input, Select } from 'antd';
import Page from './Page';
import './NewPage.css';
import { Widget, ContainerType } from '../enums';

const { Option } = Select;

const NewContainerStyle = {height: 640, border: 'dashed 3px #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center'}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            {/*<Form.Item label="Title">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator('description')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item className="collection-create-form_last-form-item">
              {getFieldDecorator('modifier', {
                initialValue: 'public',
              })(
                <Radio.Group>
                  <Radio value="public">Public</Radio>
                  <Radio value="private">Private</Radio>
                </Radio.Group>,
              )}
            </Form.Item>*/}
            {/*<Form {...this.formItemLayout}>*/}
                <Form.Item label="Page title">
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input the page title',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>

                <Form.Item label="type">
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: 'Please select the page type' }],
                  })(
                    <Select
                      placeholder="Select a option and change input text above"
                      onChange={this.handlePageTypeSelect}
                    >
                      <Option value={ ContainerType.Page["Normal"] }>Normal</Option>
                      <Option value={ ContainerType.Page["Login"] }>Log in</Option>
                      <Option value={ ContainerType.Page["SignUp"] }>Register</Option>
                      <Option value={ ContainerType.Page["ScrollableBottomSheet"] }>ScrollableBottomSheet</Option>
                      <Option value={ ContainerType.Page["OnBoard"] }>Onboard</Option>
                      <Option value={ ContainerType.Page["Chat"] }>Chat</Option>
                    </Select>,
                  )}
                </Form.Item>
            {/*</Form>*/}
          </Form>
        </Modal>
      );
    }
  },
);

class CollectionsPage extends React.Component {
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

      this.props.GetPageProps(values);
      /*alert('sdf')
      console.log('Received values of form: ', values);*/
      /** form.resetFields(); don't really need this
      this.setState({ visible: false });*/

      // setTimeout(() => window.location = window.location, 400)
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
        <div onClick={this.showModal}>
          <Page title="New Page" styling={NewContainerStyle}>
            <Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} />
          </Page>
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
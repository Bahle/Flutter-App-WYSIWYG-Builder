import React from 'react'
import { Table, Input, Button, Popconfirm, Form, Select } from 'antd';
import "./EditableTable.css"
import AutoComplete from './AutoComplete'
import Dialog from './Dialog'
import DataModelDialog from './DataModelDialog'
import modelTypeFields from '../json/ModelTypes'

const uuid = require('uuid/v4');
const EditableContext = React.createContext();

const { Option, OptGroup } = Select;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [{
      title: 'Field Name',
      dataIndex: 'fieldName',
      // width: '30%',
      // editable: true,
      render: (index, record) => <Input value={record.fieldName} onChange={this.handleFieldNameChange.bind(this, record.key)} style={{width: '100%'}} />
    }, {
      title: 'Data Type',
      dataIndex: 'dataType',
      // width: '20%',
      render: (index, record) => (
        <Select defaultValue={record.dataType || 'String'} style={{width: '100%'}} value={record.dataType} onChange={this.handleDataTypeChange.bind(this, record.key)}>
          <OptGroup label="Primitives">
            <Option value="Full Name">Full Name</Option>
            <Option value="Address">Address</Option>
            <Option value="Black Faces">Black Faces</Option>
            <Option value="Business Name">Business Name</Option>
            <Option value="City">City</Option>
            <Option value="Country">Country</Option>
            <Option value="Date">Date</Option>
            <Option value="Email">Email</Option>
            <Option value="First Name">First Name</Option>
            <Option value="Gender">Gender</Option>
            <Option value="Grocery">Grocery</Option>
            <Option value="IBAN">IBAN</Option>
            <Option value="Last Name">Last Name</Option>
            <Option value="Lat">Latitude</Option>
            <Option value="Lng">Longitude</Option>
            <Option value="Username">Username</Option>
            <Option value="Mixed Faces">Mixed Faces</Option>
            <Option value="Money">Money</Option>
            <Option value="Password">Password</Option>
            <Option value="Phone">Phone</Option>
            <Option value="Rating">Rating</Option>
            <Option value="Sentences">Sentences</Option>
            <Option value="Shirt Size">Shirt Size</Option>
            <Option value="State">State</Option>
            <Option value="Time">Time</Option>
            <Option value="Website">Website</Option>
            <Option value="Words">Words</Option>
          </OptGroup>
          <OptGroup label="Single Object">
            <Option value="Single Current">Current Object (Single)</Option>
            <Option value="Single Add New">Add new</Option>
          </OptGroup>
          <OptGroup label="Multiple Objects">
            <Option value="Multiple Current">Current Object (Multiple)</Option>
            <Option value="Multiple Add New">Add new</Option>
          </OptGroup>
        </Select>
      )
    }/*, {
      title: 'Mockup Field',
      dataIndex: 'mockupField',
      render: (index, record) => {
        // const modelTypeFields = JSON.parse(window.localStorage.modelTypes);
        return <AutoComplete value={record.mockupField} width="100%" dataSource={modelTypeFields[this.props.ModelType]} onChange={this.handleMockupField.bind(this, record.key)} />
      }
    }*/]

    this.columns = this.columns;
    this.state = {
      dataSource: this.props.Value,
      // count: 2, //?
    };
  }

  changeValue(key, field, value) {
    const dataSource = this.state.dataSource
    const rowIndex = dataSource.findIndex(data => data.key == key);
    const row = dataSource[rowIndex];
    row[field] = value;
    dataSource[rowIndex] = row
    // alert('changnig state to ' + JSON.stringify(dataSource))
    this.setState({ dataSource })
  }

  handleFieldNameChange(key, e) {
    /*const { dataSource } = this.state;
    dataSource[key].fieldName = e.target.value;
    this.setState({ dataSource });*/
    this.changeValue(key, 'fieldName', e.target.value)
  }

  handleDataTypeChange(key, value) {
    if(~value.indexOf('Add New')) {
      this.ModelDialogRef.showModal();
      return;
    }

    this.changeValue(key, 'dataType', value);
  }

  handleMockupField(key, value) {
    this.changeValue(key, 'mockupField', value)
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const newData = {
      key: uuid(),
      fieldName: '',
      dataType: '',
      mockupField: ''
    };
    this.setState({
      dataSource: [...dataSource, newData],
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Dialog Width={'1500px'} OkText='Save & Exit' ref={dialog => this.ModelDialogRef = dialog}>
          <DataModelDialog AddingTab={true} InDialog={true} />
        </Dialog>

        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <Button onClick={this.handleAdd} type="primary" style={{ float:'left', marginTop: '14px' }}>Add a row</Button>
      </div>
    );
  }
}

EditableTable.defaultProps = {
    Values: []
}

export default EditableTable
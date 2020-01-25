import React from 'react'
import { Table, Input, Button, Popconfirm, Form, Select } from 'antd';
import "./EditableTable.css"
import AutoComplete from './AutoComplete'
import Dialog from './Dialog'
import DataModelDialog from './DataModelDialog'

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
    // alert('Methods: ' + JSON.stringify(this.props.Value))

    this.columns = [{
      title: 'Method Name',
      dataIndex: 'methodName',
      width: '30%',
      // editable: true,
      render: (index, record) => <AutoComplete width="100%" dataSource={['Index', 'View', 'Update', 'Remove']} value={record.methodName} onChange={this.handleMethodNameChange.bind(this, record.key)} />
    },{
      title: 'Request Type',
      dataIndex: 'requestType',
      render: (index, record) => (
        <Select defaultValue="GET" value={record.requestType || 'GET'} style={{width: '100%'}} onChange={this.handleRequestTypeChange.bind(this)}>
          <Option value="GET">GET</Option>
          <Option value="POST">POST</Option>
          <Option value="PUT">PUT</Option>
          <Option value="DELETE">DELETE</Option>
        </Select>
      )
    },
    {
      title: 'EndPoint',
      dataIndex: 'endPoint',
      // editable: true
      render: (index, record) => {
        return <Input style={{width: '100%'}} value={record.endPoint} onChange={this.handleChangeEndPoint.bind(this, record.key)} />
      }
    },
    {
      title: 'DataType',
      dataIndex: 'dataType',
      width: '20%',
      render: (index, record) => {
        return (<Select defaultValue='String' value={record.dataType || 'String'} style={{width: '100%'}} onChange={this.handleDataTypeChange.bind(this, record.key)}>
          <OptGroup label="Primitives">
            <Option value="String">String</Option>
            <Option value="Int">Int</Option>
            <Option value="Bool">Bool</Option>
            <Option value="Date">Date</Option>
            <Option value="Float">Float</Option>
            <Option value="Enum">Enum</Option>
          </OptGroup>
          <OptGroup label="Single Object">
            <Option value="Single Current">Current Object (Single)</Option>
            { this.state.dataModelList.map(model => <Option key={`Single_${model.name}`} value={`Single ${model.name}`}>{`Single ${model.name}`}</Option>) }
            <Option value="Single Add New">Add new</Option>
          </OptGroup>
          <OptGroup label="Multiple Objects">
            <Option value="Multiple Current">Current Object (Multiple)</Option>
            { this.state.dataModelList.map(({name}) => <Option key={`Multiple_${name}`} value={`Multiple ${name}`}>{`Multiple ${name}s`}</Option>) }
            <Option value="Multiple Add New">Add new</Option>
          </OptGroup>
        </Select>)
      }
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    }];

    this.columns = this.columns;
    this.state = {
      dataSource: this.props.Value,
      dataModelList: JSON.parse(window.localStorage.modelData) //.map(model => model.name)
    };
    this.singleOrMultiple = null;
  }

  changeValue(key, field, value) {
    const dataSource = this.state.dataSource
    const rowIndex = dataSource.findIndex(data => data.key == key);
    const row = dataSource[rowIndex];
    row[field] = value;
    dataSource[rowIndex] = row
    this.setState({ dataSource })
  }

  handleChangeEndPoint(key, e) {
    this.changeValue(key, 'endPoint', e.target.value);
  }

  handleRequestTypeChange(key, value) {
    this.changeValue(key, 'requestType', value);
  }

  handleMethodNameChange(key, value) {
    // alert(JSON.stringify(value))
    // alert(JSON.stringify(record))

    const { dataSource } = this.state;
    const rowIndex = dataSource.findIndex(data => data.key == key);
    const row = dataSource[rowIndex];
    // alert(JSON.stringify(row))
    // alert(this.props.TabName.slice(-1))
    row.endPoint = this.props.TabName.toLowerCase() + (this.props.TabName.slice(-1).toLowerCase() == 's' ? 'es' : 's');
        
    switch(value) {
      case 'Index': {
        row.dataType = 'Multiple Current'; break;
      }
      case 'View': {
        row.endPoint += '/:id';
        row.dataType = 'Single Current';
        break;
      }
      case 'Update': {
        row.endPoint += '/:id';
        row.requestType = 'PUT';
        break;
      }
      case 'Remove': {
        row.endPoint += '/:id';
        row.requestType = 'DELETE';
        break;
      }
    }

    row.dataType = row.dataType || 'String'
    row.requestType = row.requestType || 'GET'
    row.methodName = value

    dataSource[rowIndex] = row
    
    this.setState({ dataSource });
  }

  handleDataTypeChange(key, value) {
    if(~value.indexOf('Add New')) {
      this.ModelDialogRef.showModal();
    }

    this.singleOrMultiple = value.indexOf('Single') != -1;
    
    this.changeValue(key, 'dataType', value)
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const newData = {
      key: uuid()
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

  handleDialogOk() {
    // this.DataModelDialogRef.SaveModel();
    const newModels = this.DataModelDialogRef.GetModels();
    let { dataModelList, dataSource } = this.state;
    console.dir(dataModelList)
    dataModelList = dataModelList.concat(newModels);

    dataSource[dataSource.length - 1].dataType = `${this.singleOrMultiple === true ? 'Single' : 'Multiple'} ${newModels[0].name}`; // select newly added model

    this.setState({ dataModelList, dataSource })
    this.props.AddTab(newModels)
    this.ModelDialogRef.showModal(false);
  }

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
        <Dialog Width={'1500px'} OkText='Save & Exit' OnOk={this.handleDialogOk.bind(this)} ref={dialog => this.ModelDialogRef = dialog}>
          <DataModelDialog ref={ref => this.DataModelDialogRef = ref} AddingTab={true} InDialog={true} />
        </Dialog>

        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <Button onClick={this.handleAdd} type="primary" style={{ position:'relative', marginTop: '14px', /*top: this.props.Values.length ? '-51px' : 0*/ }}>Add a row</Button>
      </div>
    );
  }
}

export default EditableTable
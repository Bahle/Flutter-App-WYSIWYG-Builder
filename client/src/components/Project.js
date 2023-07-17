import React from 'react'
import { Button, Modal, Form, Input, Select, Card } from 'antd';
import Page from './Page';
import './NewPage.css';
import { Widget, ContainerType } from '../enums';

const { Option } = Select;

const NewContainerStyle = {height: 640, border: 'dashed 3px #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center'}

class CollectionsPage extends React.Component {
  render() {
    return (
      <div>
        <div className="app-page">
          <Card
              hoverable
              style={NewContainerStyle}
            >
            <Button type="primary" icon="file" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} />
          </Card>
          <div className="page-title" style={{textAlign: 'center'}}>{this.props.title || 'Project'}</div>
        </div>

        {/*<Page title={this.props.title || 'Project'} styling={NewContainerStyle}>
          <Button type="primary" icon="file" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} />
        </Page>*/}
      </div>
    );
  }
}

// ReactDOM.render(<CollectionsPage />, mountNode);
export default CollectionsPage;
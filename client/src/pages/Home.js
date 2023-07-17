import React, { Component } from 'react';
import { Row, Col, Card, Statistic, Button, Icon } from 'antd';
// import axios from 'axios';
// import { SERVER_URL } from '../../constants';
// import UserProfile from '../../UserProfile';
import '../css/Layout.css';
import DashboardLayout from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const colourDataSource = [
  { key: 'Primary', name: 'Primary', materialColor: 'blue500', colorCode: '#2196f3' },
  { key: 'Secondary', name: 'Secondary', materialColor: 'pinkA400', colorCode: '#f50057' },
  { key: 'Background', name: 'Background', materialColor: 'white', colorCode: '#ffffff' },
  { key: 'Surface', name: 'Surface', materialColor: 'white', colorCode: '#ffffff' },
  { key: 'Error', name: 'Error', materialColor: 'red700', colorCode: '#d32f2f' },
  { key: 'OnPrimary', name: 'On Primary', materialColor: 'white', colorCode: '#ffffff' },
  { key: 'OnSecondary', name: 'On Secondary', materialColor: 'black', colorCode: '#000000' },
  { key: 'OnBackground', name: 'On Background', materialColor: 'black', colorCode: '#000000' },
  { key: 'OnSurface', name: 'On Surface', materialColor: 'black', colorCode: '#000000' },
  { key: 'OnError', name: 'On Error', materialColor: 'white', colorCode: '#ffffff' }
];

window.localStorage.themeData = "{\"color\":" + JSON.stringify(colourDataSource) + ",\"typography\":{},\"icons\":\"\"}";

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <DashboardLayout title='Projecst'>
        <div style={{ background: '#fff', minHeight: 380 }}>
          <Row gutter={16}>
            { [...Array(10).keys()].map((i) => {
            return (<Col lg={6} md={12}>
              <Link to={`/project/${i}`}>
                  <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                      style={{marginBottom: '30px'}}
                    >
                      <Meta title="Europe Street beat" description="www.instagram.com" />
                  </Card>
                </Link>
              </Col>
              ) }) }
            </Row>
        </div>
      </DashboardLayout>)
  }
}

export default Home;
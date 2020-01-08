import React, { Component } from 'react';
import { Row, Col, Card, Statistic, Button, Icon } from 'antd';
// import axios from 'axios';
// import { SERVER_URL } from '../../constants';
// import UserProfile from '../../UserProfile';
import '../css/Layout.css';
import DashboardLayout from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';

const { Meta } = Card;


class Home extends Component {
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
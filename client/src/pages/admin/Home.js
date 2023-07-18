import React, { Component } from 'react';
import { Row, Col, Card, Statistic, Button, Icon, Spin } from 'antd';
import axios from 'axios';
import { SERVER_URL } from '../../constants';
import UserProfile from '../../UserProfile';
import '../../css/Layout.css';
import DashboardLayout from '../../layout/DashboardLayout';
import { Link } from 'react-router-dom';
// import SingleFileUpload from '../../components/SingleFileUpload';
import NewProject from '../../components/NewProject';
import Project from '../../components/Project';

const { Meta } = Card;

String.prototype.ucFirst = function() {
  return this[0].toUpperCase() + this.slice(1)
};

class Home extends Component {
  constructor(props) {
    super(props)

    // if(window.location.pathname == "/") {
      // alert('kuriaa!')
      ///! uncomment this later
      /* *** window.localStorage.clear();

      window.localStorage.pages = "[]";
      window.localStorage.dataModels = "[]";
      window.localStorage.modelData = "[]";
      window.localStorage.movedShapes = "{}";*/
    // }
  }

  state = {
    projects: null
  }

  componentDidMount() {
    axios
      .get('/project')
      .then(response => {
        console.log('the projects are ' + response.data.results)
        this.setState({projects: response.data.results || []})
      })
      .catch(err => console.error('error occured: ' + err))
  }

  render() {
    return (
      <DashboardLayout title='Projects'>
        <div style={{ background: '#fff', minHeight: 380 }}>
          <Row gutter={16}>
            { !this.state.projects ? <Spin size="large" /> : this.state.projects.map(project => (<Col key={project} lg={6} md={12}> {/* [...Array(2).keys()] */}
              <Link to={`/project/${project}`}>
                  <Project title={project} />
                </Link>
              </Col>
              ) ) }

              <Col><NewProject /></Col>
            </Row>
        </div>
      </DashboardLayout>)
  }
}

export default Home;
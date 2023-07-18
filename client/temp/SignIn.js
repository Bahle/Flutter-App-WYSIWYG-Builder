import React, { Component } from 'react';
import { Card, Form, Icon, Input, Button, Checkbox } from 'antd';
import './index.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import UserProfile from '../../UserProfile';
import { SERVER_URL } from '../../constants';

const FormItem = Form.Item;

// var server = ''; // put this in a file called constants

class NormalLoginForm extends Component {
  state = {
  	toDashboard: false,
  	loginError: false
  }

  handleSubmit = (e) => {
    e.preventDefault();

     this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

      axios.post('/sign-in', {
    		username: values.username,
    		password: values.password
    	}).then((response) => {
    		console.log('Received from server: ' + JSON.stringify(response.data));
        const { data: {results, data} } = response;

        if(results === 'success') {
          UserProfile.setUserID(data.userID);
    			UserProfile.setName(values.username);
          UserProfile.setFullName(data.fullName);
          UserProfile.setPrivileges(data.privilege);
  				
          this.setState(() => ({
  			        toDashboard: true
  			    }));
    		} else {
    			this.setState(() => ({
		        	loginError: true
		      	}));
      		}
        	}).catch((err) => {
        		console.log(err);
        	});
        }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    
    if (this.state.toDashboard === true) {
      return <Redirect to='/' />
    }

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>

        {this.state.loginError && <div style={{color: 'red'}}>Incorrect email and/or password entered</div>}

        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

class SignIn extends Component {
	render() {
		return (
			<div style={{ padding: 80, textAlign: 'center' }}>
				<Icon type="solution" style={{ fontSize: 42, margin: 10 }} />
				<h3>SMS Management System</h3>
				<Card bordered={true} style={{ width: 350, margin: 'auto' }}>
					<WrappedNormalLoginForm />
				</Card>
			</div>
		)
	}
}

export default SignIn;
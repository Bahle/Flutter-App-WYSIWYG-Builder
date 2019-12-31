import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import UserProfile from '../../UserProfile'

class LogOut extends Component {
	componentWillMount() {
		UserProfile.logOut();
	}

	render() {
		return <Redirect to='/sign-in' />
	}
}

export default LogOut;
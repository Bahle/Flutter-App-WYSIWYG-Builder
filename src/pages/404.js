import React, { Component } from 'react';

class NotFound extends Component {
	render() {
		return (
			<div style={{padding:'40px', textAlign: 'center'}}>
			  <h1>Page Not Found</h1>

			  <div>The requested page could not be located. Make sure you visited a proper link or typed the right address in address bar.</div>
			</div>
		)
	}
}

export default NotFound;
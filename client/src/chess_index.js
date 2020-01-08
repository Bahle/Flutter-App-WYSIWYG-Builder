import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './chess/index.js';
import * as serviceWorker from './serviceWorker';
import observe from './chess/Game'
import Board from './chess/Board'

observe(knightPosition => {
	ReactDOM.render(<div style={{ height: '540px', width: '540px'}}><Board knightPosition={knightPosition} /></div>, document.getElementById('root'));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

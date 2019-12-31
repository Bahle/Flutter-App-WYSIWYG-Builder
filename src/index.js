import React from 'react';
// import { Provider } from 'mobx-react'
import IncomeDomainStore from './incomeDomainStore'
import IncomeUiStore from './incomeUiStore'
import App from './App'
import Home from './pages/Home'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
		<BrowserRouter>
			<App />
		</BrowserRouter>,
document.getElementById('root'))
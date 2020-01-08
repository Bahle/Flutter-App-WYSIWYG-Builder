import React from 'react';
import IncomeDomainStore from './incomeDomainStore'
import IncomeUiStore from './incomeUiStore'
import App from './App'
import Home from './pages/Home'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react'
import ToolDomainStore from './stores/toolDomainStore'

ReactDOM.render(
	<Provider toolDomainStore={new ToolDomainStore()}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
document.getElementById('root'))
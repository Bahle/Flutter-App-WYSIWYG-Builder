import React, { Component } from 'react';

/*import SignIn from './pages/admin/SignIn';
import LogOut from './pages/admin/LogOut';*/

import Home from './pages/admin/Home';
import Project from './pages/admin/Project';
import DataModelDialog from './components/DataModelDialog';
/*import Test from './pages/admin/Test';*/

/*import UserList from './pages/admin/Users/List.js';
import UserNew from './pages/admin/Users/New.js';
import UserDetails from './pages/admin/Users/Details.js';
import UserEdit from './pages/admin/Users/Edit.js';

import CreditList from './pages/admin/Credits/List.js';

*/

import NotFound from './pages/404';

import { Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
            <Route exact path="/data-model-dialog" component={DataModelDialog}/>
            <Route exact path="/" component={Home}/>
            <Route exact path="/project/:id" component={Project}/>
            <Route component={NotFound} exact />
        </Switch>
      </div>
    );
  }
}

export default App;

import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { Provider } from 'react-redux';

import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/animate.min.css"
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0"
import "./assets/css/demo.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

import AdminLayout from "layouts/Admin.js"
import Login from "views/maseeha/Login"
import Register from "views/maseeha/Register"

import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import Routes from 'views/maseeha/routing/Routes';

const App = () => {
  React.useEffect(() => {
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={Routes} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default App;

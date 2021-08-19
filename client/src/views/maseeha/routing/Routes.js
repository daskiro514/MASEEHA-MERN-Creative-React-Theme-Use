import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Login from "views/maseeha/Login"
import Register from "views/maseeha/Register"
import ForgotPassword from "views/maseeha/ForgotPassword"
import Admin from "views/maseeha/Admin"


const Routes = props => {


  return (
    <>
      <Switch>
        <>
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/forgot" component={ForgotPassword} />
          <Route path="/admin" component={Admin} />
          
          {/* <Redirect from="/" to="/login" /> */}
        </>
      </Switch>
    </>
  );
};

export default Routes;

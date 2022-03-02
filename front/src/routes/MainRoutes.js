import React from "react";
import { Route, Switch } from "react-router-dom";

import Pages from '../container';
import { WelcomePage } from '../container/WelcomePage';
import { InvitePage, LoginPage, RegisterPage } from '../container/Auth';
import { TaskPage, MSDSPage } from '../container/Contractor';
import { InstructionPage, LoadDataPage } from '../container/Auth/CompanyRegister';
import PrivateRoute from './PrivateRoute';
import InviteRoute from './InviteRoute';
import EmptyPage from '../container/404';

export default function MainRoutes() {
  return (
    
        <Switch>
          <Route exact path="/" component={WelcomePage} />
          <PrivateRoute path="/dashboard" component={Pages} />
          <Route path="/login" component={LoginPage} />
          <Route path="/contractor/msds" component={MSDSPage} />
          <Route path="/contractor/invite/*" component={InvitePage} />
          <InviteRoute path="/contractor/invite" component={InvitePage} />
          <InviteRoute path="/contractor/task" component={TaskPage} />
          <Route path="/company/instruction" component={InstructionPage} />
          <Route path="/company/loaddata" component={LoadDataPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/404" component={EmptyPage} />
        </Switch>
      
  );
}
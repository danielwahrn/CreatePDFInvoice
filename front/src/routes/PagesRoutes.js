import React from "react";
import { Route, Switch } from "react-router-dom";

import  {ContractorPage}  from '../container/Admin/ContractorPage';
import  {DocketsPage}  from '../container/Admin/DocketsPage';
import { TasksPage } from '../container/Admin/TasksPage';
import { HistoryPage } from '../container/Admin/HistoryPage';
import { InformationPage } from '../container/Admin/InformationPage';


export default function PagesRoutes() {
    return (
        <Switch>
            <Route path="/dashboard/users" component={ContractorPage} />
            <Route path="/dashboard/dockets" component={DocketsPage} />
            <Route path="/dashboard/tasks" component={TasksPage} />
            <Route path="/dashboard/history" component={HistoryPage} />
            <Route path="/dashboard/information" component={InformationPage} />
        </Switch>
    );
}
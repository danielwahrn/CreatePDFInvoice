import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import  {ContractorPage}  from '../container/ContractorPage';
import  {DocketsPage}  from '../container/DocketsPage';
import { TasksPage } from '../container/TasksPage';
import { HistoryPage } from '../container/HistoryPage';
import { InformationPage } from '../container/InformationPage';


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
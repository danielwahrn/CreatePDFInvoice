import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Api from '../Api';

const InviteRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        Api.isContractor()
            ? (Api.enableMSDS() ? <Component {...props} /> : <Redirect to="/contractor/msds" />)
            : <Redirect to={{pathname: '/404', state: { from: props.location } }} />
    )} />
)

export default InviteRoute
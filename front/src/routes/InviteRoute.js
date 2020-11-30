import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const InviteRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        window.localStorage.getItem('user')
            ? <Component {...props} />
            : <Redirect to={{pathname: '/404', state: { from: props.location } }} />
    )} />
)

export default InviteRoute
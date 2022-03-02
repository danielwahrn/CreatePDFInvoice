import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Api from '../Api';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        Api.isAdmin()
            ? <Component {...props} />
            : <Redirect to={{pathname: '/', state: { from: props.location } }} />
    )} />
)

export default PrivateRoute
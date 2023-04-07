import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Home from './Pages/Home'
import Timeline from './Pages/Timeline'
import Search from './Pages/Search';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';

import { isAuthenticated } from './services/auth';

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => (
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            )
        )} />
    )
}

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <PrivateRoute path="/timeline" component={Timeline} />
                <PrivateRoute path="/search" component={Search} />
                <PrivateRoute path="/profile/:id" component={Profile} />
                <PrivateRoute path="/settings" component={Settings} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;
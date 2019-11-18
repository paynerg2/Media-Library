import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { history } from '../_helpers/history';
import { PrivateRoute } from '../_components/PrivateRoute';
import RegistrationPage from '../Views/RegistrationPage/RegistrationPage';
import LoginPage from '../Views/LoginPage/LoginPage';
import Header from '../_components/Header/Header';
import HomePage from '../Views/HomePage/HomePage';
import { useDispatch } from 'react-redux';
import { seriesActions, companyActions, bookActions } from '../_actions';
import { useSelector } from '../_helpers/useSelector';

export const App: React.FC = () => {
    const { loggedIn } = useSelector(state => state.authentication);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(seriesActions.getAll());
        dispatch(bookActions.getAll());
    }, [loggedIn]);

    return (
        <Router history={history}>
            <Route path="/" component={Header} />
            {/* Add things like footer, sidebar, breadcrumbs, etc. here */}
            <Switch>
                <Route path="/register" component={RegistrationPage} />
                <Route path="/login" component={LoginPage} />

                <PrivateRoute path="/" exact component={HomePage} />
            </Switch>
        </Router>
    );
};

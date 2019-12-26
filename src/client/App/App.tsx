import React, { useEffect, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { history } from '../_helpers/history';
import { PrivateRoute } from '../_components/PrivateRoute';
import RegistrationPage from '../Views/RegistrationPage/RegistrationPage';
import LoginPage from '../Views/LoginPage/LoginPage';
import Header from '../_components/Header/Header';
import HomePage from '../Views/HomePage/HomePage';
import NewBookPage from '../Views/NewBookPage/NewBookPage';
import { useDispatch } from 'react-redux';
import {
    seriesActions,
    companyActions,
    bookActions,
    creatorActions,
    discActions,
    gameActions
} from '../_actions';
import { useSelector } from '../_hooks';
import NewDiscPage from '../Views/NewDisc/NewDiscPage';
import NewGamePage from '../Views/NewGamePage/NewGamePage';
import BookDisplayPage from '../Views/BookDisplayPage/BookDisplayPage';
import DiscDisplayPage from '../Views/DiscDisplayPage/DiscDisplayPage';
import GameDisplayPage from '../Views/GameDisplayPage/GameDisplayPage';
import SeriesDisplayPage from '../Views/SeriesDisplayPage/SeriesDisplayPage';
import CreatorDisplayPage from '../Views/CreatorDisplayPage/CreatorDisplayPage';
import CompanyDisplayPage from '../Views/CompanyDisplayPage/CompanyDisplayPage';

export const App: React.FC = () => {
    const { loggedIn } = useSelector(state => state.authentication);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(companyActions.getAll());
        dispatch(creatorActions.getAll());
        dispatch(seriesActions.getAll());
        dispatch(bookActions.getAll());
        dispatch(discActions.getAll());
        dispatch(gameActions.getAll());
    }, [loggedIn, dispatch]);

    return (
        <Router history={history}>
            <Route path="/" component={Header} />
            {/* Add things like footer, sidebar, breadcrumbs, etc. here */}
            <Switch>
                <Route path="/register" component={RegistrationPage} />
                <Route path="/login" component={LoginPage} />

                <PrivateRoute path="/" exact component={HomePage} />
                <PrivateRoute path="/books/new" exact component={NewBookPage} />
                <PrivateRoute path="/discs/new" exact component={NewDiscPage} />
                <PrivateRoute path="/games/new" exact component={NewGamePage} />

                <Route
                    path="/books"
                    render={({ match: { path } }) => (
                        <Fragment>
                            <PrivateRoute
                                path={`${path}/:id`}
                                component={BookDisplayPage}
                                exact
                            />
                            <PrivateRoute
                                path={`${path}/edit/:id`}
                                component={NewBookPage}
                                exact
                            />
                        </Fragment>
                    )}
                />
                <Route
                    path="/discs"
                    render={({ match: { path } }) => (
                        <Fragment>
                            <PrivateRoute
                                path={`${path}/:id`}
                                component={DiscDisplayPage}
                                exact
                            />
                            <PrivateRoute
                                path={`${path}/edit/:id`}
                                component={NewDiscPage}
                                exact
                            />
                        </Fragment>
                    )}
                />
                <Route
                    path="/games"
                    render={({ match: { path } }) => (
                        <Fragment>
                            <PrivateRoute
                                path={`${path}/:id`}
                                component={GameDisplayPage}
                                exact
                            />
                            <PrivateRoute
                                path={`${path}/edit/:id`}
                                component={NewGamePage}
                                exact
                            />
                        </Fragment>
                    )}
                />
                <Route
                    path="/series"
                    render={({ match: { path } }) => (
                        <Fragment>
                            <PrivateRoute
                                path={`${path}/:id`}
                                component={SeriesDisplayPage}
                                exact
                            />
                        </Fragment>
                    )}
                />
                <Route
                    path="/creators"
                    render={({ match: { path } }) => (
                        <Fragment>
                            <PrivateRoute
                                path={`${path}/:id`}
                                component={CreatorDisplayPage}
                                exact
                            />
                        </Fragment>
                    )}
                />
                <Route
                    path="/companies"
                    render={({ match: { path } }) => (
                        <Fragment>
                            <PrivateRoute
                                path={`${path}/:id`}
                                component={CompanyDisplayPage}
                                exact
                            />
                        </Fragment>
                    )}
                />
            </Switch>
        </Router>
    );
};

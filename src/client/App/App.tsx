import React, { useEffect, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';

import { theme } from './theme';
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

import './App.css';

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
        <ThemeProvider theme={theme}>
            <Layout>
                <Router history={history}>
                    <LayoutHeader>
                        <Route path="/" component={Header} />
                    </LayoutHeader>
                    {/* Add things like footer, sidebar, breadcrumbs, etc. here */}
                    <Content>
                        <Switch>
                            <Route
                                path="/register"
                                component={RegistrationPage}
                            />
                            <Route path="/login" component={LoginPage} />

                            <PrivateRoute path="/" exact component={HomePage} />
                            <PrivateRoute
                                path="/books/new"
                                exact
                                component={NewBookPage}
                            />
                            <PrivateRoute
                                path="/discs/new"
                                exact
                                component={NewDiscPage}
                            />
                            <PrivateRoute
                                path="/games/new"
                                exact
                                component={NewGamePage}
                            />

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
                    </Content>
                </Router>
            </Layout>
        </ThemeProvider>
    );
};

const Layout = styled.div`
    display: grid;

    grid-template-areas:
        'header header header'
        '. content .';

    grid-template-columns: 15vw 1fr 15vw;
    grid-template-rows: auto 1fr;
    grid-gap: 10px;

    height: 100vh;

    @media (max-width: 768px) {
        grid-template-areas: 'header' 'content';
        grid-template-columns: 100vw;
        grid-template-rows: auto 1fr;
    }
`;

const LayoutHeader = styled.div`
    grid-area: header;
`;

const Content = styled.div`
    grid-area: content;

    @media (max-width: 768px) {
        margin-left: 2vw;
        margin-right: 2vw;
    }
`;

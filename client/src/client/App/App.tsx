import React, { useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { theme as lightTheme, darkTheme } from './theme';
import { history } from '../_helpers/history';
import { PrivateRoute } from '../_components/PrivateRoute';
import RegistrationPage from '../Views/RegistrationPage/RegistrationPage';
import LoginPage from '../Views/LoginPage/LoginPage';
import Header from '../_components/Header/Header';
import HomePage from '../Views/HomePage/HomePage';
import Footer from '../_components/Footer/Footer';
import NewBookPage from '../Views/NewBookPage/NewBookPage';
import {
    seriesActions,
    companyActions,
    bookActions,
    creatorActions,
    discActions,
    gameActions
} from '../_actions';
import { useSelector, useDarkMode } from '../_hooks';
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
    const { theme, toggleTheme } = useDarkMode();
    const themeMode = theme === 'light' ? lightTheme : darkTheme;

    useEffect(() => {
        dispatch(companyActions.getAll());
        dispatch(creatorActions.getAll());
        dispatch(seriesActions.getAll());
        dispatch(bookActions.getAll());
        dispatch(discActions.getAll());
        dispatch(gameActions.getAll());
    }, [loggedIn, dispatch]);

    return (
        <ThemeProvider theme={themeMode}>
            <Layout>
                <Router history={history}>
                    <LayoutHeader>
                        <Route
                            path="/"
                            render={props => (
                                <Header {...props} toggleTheme={toggleTheme} />
                            )}
                        />
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

                    <LayoutFooter>
                        <Footer />
                    </LayoutFooter>
                </Router>
            </Layout>
        </ThemeProvider>
    );
};

const Layout = styled.div`
    display: grid;

    grid-template-areas:
        'header header header'
        '. content .'
        'footer footer footer';

    grid-template-columns: 15vw 1fr 15vw;
    grid-template-rows: auto 1fr auto;
    grid-gap: 10px;

    min-height: 100vh;
    background: ${props => props.theme.colors.background};

    @media (max-width: 768px) {
        grid-template-areas: 'header' 'content' 'footer';
        grid-template-columns: 100%;
        grid-template-rows: auto 1fr auto;
        width: 100%;
        grid-gap: 0;
    }
`;

const LayoutHeader = styled.div`
    grid-area: header;
`;

const LayoutFooter = styled.div`
    grid-area: footer;
`;

const Content = styled.div`
    grid-area: content;
`;

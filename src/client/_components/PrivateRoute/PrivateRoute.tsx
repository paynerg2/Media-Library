import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: any;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, ...rest } = props;
    const user = localStorage.getItem('user');
    const { token } = user && JSON.parse(user);
    const isSignedIn = token !== null;

    return (
        <Route
            {...rest}
            render={routeProps =>
                isSignedIn ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: routeProps.location }
                        }}
                    />
                )
            }
        />
    );
};

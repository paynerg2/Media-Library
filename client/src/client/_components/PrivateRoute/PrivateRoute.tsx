import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: any;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, ...rest } = props;
    const user = localStorage.getItem('user');
    let isSignedIn: boolean = false;
    if (user) {
        const userObject = user && JSON.parse(user);
        isSignedIn = userObject.token && userObject.token !== null;
    }

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

import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from '../../_helpers/useSelector';

interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: any;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, ...rest } = props;
    const isSignedIn = useSelector(state => state.authentication.loggedIn);

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

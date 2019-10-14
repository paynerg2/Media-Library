import { authenticationConstants } from '../_constants';
import { authenticationService } from '../_services/';
import { AuthenticationActionTypes } from './types';
import { AuthenticatedUser } from '../_interfaces';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const login = (username: String, password: String) => async (
    dispatch: Dispatch<AnyAction>
) => {
    try {
        dispatch(request());
        const authenticatedUser = await authenticationService.login(
            username,
            password
        );
        dispatch(success(authenticatedUser));
    } catch (err) {
        dispatch(failure(err));
    }

    function request(): AuthenticationActionTypes {
        return {
            type: authenticationConstants.LOGIN_REQUEST
        };
    }
    function success(
        authenticatedUser: AuthenticatedUser
    ): AuthenticationActionTypes {
        return {
            type: authenticationConstants.LOGIN_SUCCESS,
            user: authenticatedUser
        };
    }
    function failure(error: Error): AuthenticationActionTypes {
        return {
            type: authenticationConstants.LOGIN_FAILURE,
            error
        };
    }
};

const logout = () => {
    authenticationService.logout();
    const logoutAction: AuthenticationActionTypes = {
        type: authenticationConstants.LOGOUT
    };
    return logoutAction;
};

export const authenticationActions = {
    login,
    logout
};

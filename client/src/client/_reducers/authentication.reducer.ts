import { AuthenticationState } from '../_interfaces';
import { authenticationConstants } from '../_constants';
import {
    AuthenticationActionTypes,
    ILoginSuccessActionCreator,
    ILoginFailureActionCreator
} from '../_actions/types';

export const initialState: AuthenticationState = {
    loggingIn: false,
    loggedIn: false,
    user: null
};

export const authentication = (
    state = initialState,
    action: AuthenticationActionTypes
): AuthenticationState => {
    switch (action.type) {
        case authenticationConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                loggedIn: false,
                user: null
            } as AuthenticationState;
        case authenticationConstants.LOGIN_SUCCESS:
            return {
                loggingIn: false,
                loggedIn: true,
                user: (action as ILoginSuccessActionCreator).user
            } as AuthenticationState;
        case authenticationConstants.LOGIN_FAILURE:
            return {
                loggingIn: false,
                loggedIn: false,
                user: null,
                error: (action as ILoginFailureActionCreator).error
            } as AuthenticationState;
        case authenticationConstants.LOGOUT:
            return initialState;
        default:
            return state;
    }
};

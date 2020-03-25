import { authenticationConstants } from '../../_constants';
import { AuthenticatedUser } from '../../_interfaces';

interface ILoginRequestActionCreator {
    type: typeof authenticationConstants.LOGIN_REQUEST;
}

export interface ILoginSuccessActionCreator {
    type: typeof authenticationConstants.LOGIN_SUCCESS;
    user: AuthenticatedUser;
}

export interface ILoginFailureActionCreator {
    type: typeof authenticationConstants.LOGIN_FAILURE;
    error: Error;
}

interface ILogoutActionCreator {
    type: typeof authenticationConstants.LOGOUT;
}

export type AuthenticationActionTypes =
    | ILoginRequestActionCreator
    | ILoginSuccessActionCreator
    | ILoginFailureActionCreator
    | ILogoutActionCreator;

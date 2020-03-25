import { userConstants } from '../../_constants/user.constants';

interface IUserRequestActionCreator {
    type: typeof userConstants.CREATE_REQUEST;
}

export interface IUserFailureActionCreator {
    type: typeof userConstants.CREATE_FAILURE;
    error: Error;
}

export type UserActionTypes =
    | IUserFailureActionCreator
    | IUserRequestActionCreator;

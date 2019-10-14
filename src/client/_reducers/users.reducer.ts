import { UserState } from '../_interfaces';
import { userConstants } from '../_constants';
import { UserActionTypes, IUserFailureActionCreator } from '../_actions/types';

export const initialState: UserState = {
    loading: false,
    error: null
};

export const users = (
    state = initialState,
    action: UserActionTypes
): UserState => {
    switch (action.type) {
        case userConstants.CREATE_REQUEST:
            return {
                loading: true,
                error: null
            } as UserState;
        case userConstants.CREATE_SUCCESS:
            return {
                loading: false,
                error: null
            } as UserState;
        case userConstants.CREATE_FAILURE:
            const error = (action as IUserFailureActionCreator).error;
            return {
                loading: false,
                error: error
            } as UserState;
        default:
            return state;
    }
};

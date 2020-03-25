import { userConstants } from '../_constants';
import { userService } from '../_services/user.service';
import { UserActionTypes } from './types/user.action.types';
import { User } from '../_interfaces';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const create = (user: User) => async (dispatch: Dispatch<AnyAction>) => {
    try {
        dispatch(request());
        await userService.create(user);
        dispatch(success());
    } catch (err) {
        dispatch(failure(err));
    }

    function request(): UserActionTypes {
        return { type: userConstants.CREATE_REQUEST };
    }
    function success(): UserActionTypes {
        return { type: userConstants.CREATE_SUCCESS };
    }
    function failure(error: Error): UserActionTypes {
        return {
            type: userConstants.CREATE_FAILURE,
            error
        };
    }
};

export const userActions = {
    create
};

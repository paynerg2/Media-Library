import { appConstants } from '../_constants';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const reset = () => async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: appConstants.APP_RESET });
};

export const appActions = {
    reset
};

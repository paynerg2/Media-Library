import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { appConstants } from '../_constants';

const reset = () => async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: appConstants.APP_RESET });
};

export const appActions = {
    reset: { type: appConstants.APP_RESET }
};

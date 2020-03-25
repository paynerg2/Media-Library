import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { searchConstants } from '../_constants';

const search = (term: string) => async (dispatch: Dispatch<AnyAction>) => {
    try {
        dispatch({
            type: searchConstants.SEARCH,
            term
        });
    } catch (err) {
        // Clear search on any error
        dispatch({
            type: searchConstants.SEARCH,
            term: ''
        });
    }
};

export const searchActions = {
    search
};

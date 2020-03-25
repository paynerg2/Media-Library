import { SearchState } from '../_interfaces';
import { searchConstants } from '../_constants';

export const initialState: SearchState = {
    term: ''
};

export type SearchActionType = {
    type: typeof searchConstants.SEARCH;
    term: string;
};

export const search = (
    state = initialState,
    action: SearchActionType
): SearchState => {
    switch (action.type) {
        case searchConstants.SEARCH:
            return {
                term: action.term
            } as SearchState;
        default:
            return state;
    }
};

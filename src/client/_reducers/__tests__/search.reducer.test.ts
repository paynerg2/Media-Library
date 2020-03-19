import { SearchState } from '../../_interfaces';
import { initialState, search, SearchActionType } from '../search.reducer';
import { searchConstants } from '../../_constants';

describe('Search Reducer', () => {
    describe('When no action present', () => {
        it('Returns default state if no initial state is present', () => {
            const defaultState: SearchState = initialState;
            expect(search(undefined, {} as SearchActionType)).toEqual(
                defaultState
            );
        });

        it('Returns state', () => {
            expect(search(initialState, {} as SearchActionType)).toEqual(
                initialState
            );
        });
    });

    describe('Search action', () => {
        it('Sets a search term', () => {
            const testSearchTerm = 'test';

            const action: SearchActionType = {
                type: searchConstants.SEARCH,
                term: testSearchTerm
            };

            const expectedState: SearchState = {
                term: testSearchTerm
            };

            expect(search(initialState, action)).toEqual(expectedState);
        });
    });
});

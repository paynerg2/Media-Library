import { users } from '../users.reducer';
import { userConstants } from '../../_constants';
import { UserState } from '../../_interfaces';
import { Action } from 'redux';

describe('Users Reducer', () => {
    const testMessage = 'test';
    const initialState: UserState = {
        loading: false,
        error: null
    };

    describe('When no action present', () => {
        it('Returns default state if no initial state present', () => {
            const defaultState: UserState = {
                loading: false,
                error: null
            };
            expect(users(undefined, {} as Action)).toEqual(defaultState);
        });

        it('Returns state', () => {
            expect(users(initialState, {} as Action)).toEqual(initialState);
        });
    });

    describe('Create Actions', () => {
        it('handles create request', () => {
            const action = {
                type: userConstants.CREATE_REQUEST
            };
            const expectedState: UserState = {
                loading: true,
                error: null
            };
            expect(users(initialState, action)).toEqual(expectedState);
        });

        it('Handles create success', () => {
            const requestState: UserState = {
                loading: true,
                error: null
            };
            const action = { type: userConstants.CREATE_SUCCESS };
            const expectedState: UserState = initialState;
            expect(users(requestState, action)).toEqual(expectedState);
        });

        it('Handles create failure', () => {
            const action = {
                type: userConstants.CREATE_FAILURE,
                error: Error(testMessage)
            };
            const expectedState: UserState = {
                loading: false,
                error: Error(testMessage)
            };
            expect(users(initialState, action)).toEqual(expectedState);
        });
    });
});

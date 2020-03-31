import { Action } from 'redux';
import { authentication } from '../authentication.reducer';
import { authenticationConstants } from '../../_constants';
import { AuthenticationState, AuthenticatedUser } from '../../_interfaces';

describe('Authentication Reducer', () => {
    const testMessage = 'test';
    const authedTestUser: AuthenticatedUser = {
        username: 'test',
        email: 'test@test.com',
        createdDate: new Date(),
        token: 'test',
        __v: 0,
        _id: 'testid'
    };
    const initialState: AuthenticationState = {
        loggingIn: false,
        loggedIn: false,
        user: null
    };

    describe('When no action present', () => {
        it('Returns default state if no initial state is present', () => {
            const defaultState: AuthenticationState = initialState;
            expect(authentication(undefined, {} as Action)).toEqual(
                defaultState
            );
        });

        it('Returns state', () => {
            expect(authentication(initialState, {} as Action)).toEqual(
                initialState
            );
        });
    });

    describe('Login Actions', () => {
        it('Handles login request', () => {
            const action = {
                type: authenticationConstants.LOGIN_REQUEST
            };
            const expectedState: AuthenticationState = {
                loggingIn: true,
                loggedIn: false,
                user: null
            };
            expect(authentication(initialState, action)).toEqual(expectedState);
        });

        it('Handles login success', () => {
            const requestState: AuthenticationState = {
                loggingIn: true,
                loggedIn: false,
                user: null
            };
            const action = {
                type: authenticationConstants.LOGIN_SUCCESS,
                user: authedTestUser
            };
            const expectedState: AuthenticationState = {
                loggingIn: false,
                loggedIn: true,
                user: authedTestUser
            };
            expect(authentication(requestState, action)).toEqual(expectedState);
        });

        it('Handles login failure', () => {
            const requestState: AuthenticationState = {
                loggingIn: true,
                loggedIn: false,
                user: null
            };
            const action = {
                type: authenticationConstants.LOGIN_FAILURE,
                error: Error(testMessage)
            };
            const expectedState: AuthenticationState = {
                loggingIn: false,
                loggedIn: false,
                user: null,
                error: Error(testMessage)
            };
            expect(authentication(requestState, action)).toEqual(expectedState);
        });
    });

    describe('Logout Actions', () => {
        it('Handles logout', () => {
            const loggedInState = {
                loggingIn: false,
                loggedIn: true,
                user: authedTestUser
            };
            const action = { type: authenticationConstants.LOGOUT };
            const expectedState = initialState;
            expect(authentication(loggedInState, action)).toEqual(
                expectedState
            );
        });
    });
});

import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import { authenticationConstants } from '../../_constants';
import { authenticationActions } from '../../_actions';
import { authenticationService } from '../../_services';
import { User, AuthenticatedUser } from '../../_interfaces';

const mockStore = configureMockStore([thunkMiddleware]);

describe('Authentication Action Creator', () => {
    describe('Login', () => {
        const testUser: User = {
            username: 'test',
            password: 'test',
            email: 'test@test.com',
            createdDate: new Date()
        };

        describe('On successful request', () => {
            const authedTestUser: AuthenticatedUser = {
                username: testUser.username,
                email: testUser.email,
                createdDate: testUser.createdDate!,
                token: 'test',
                __v: 0,
                _id: 'testid'
            };

            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                authenticationService.login = jest.fn(() =>
                    Promise.resolve(authedTestUser)
                );
                store = mockStore();

                await store.dispatch<any>(
                    authenticationActions.login(
                        testUser.username,
                        testUser.password
                    )
                );
            });

            it('Calls the login() service method with expected parameters', () => {
                expect(authenticationService.login).toHaveBeenCalledWith(
                    testUser.username,
                    testUser.password
                );
            });

            it('Dispatches request and success actions', () => {
                const expectedActions = [
                    {
                        type: authenticationConstants.LOGIN_REQUEST
                    },
                    {
                        type: authenticationConstants.LOGIN_SUCCESS,
                        user: authedTestUser
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('On unsuccessful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;
            const testErrorMessage = 'test';
            beforeEach(async () => {
                authenticationService.login = jest.fn(() =>
                    Promise.reject(Error(testErrorMessage))
                );
                store = mockStore();

                await store.dispatch<any>(
                    authenticationActions.login(
                        testUser.username,
                        testUser.password
                    )
                );
            });

            it('Dispatches request and failure actions', () => {
                const expectedActions = [
                    {
                        type: authenticationConstants.LOGIN_REQUEST
                    },
                    {
                        type: authenticationConstants.LOGIN_FAILURE,
                        error: Error(testErrorMessage)
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});

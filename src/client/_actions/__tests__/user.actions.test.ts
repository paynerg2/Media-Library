import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import { userConstants } from '../../_constants';
import { userActions } from '../../_actions';
import { userService } from '../../_services';
import { User } from '../../_interfaces';

const mockStore = configureMockStore([thunkMiddleware]);

describe('User Action Creator', () => {
    describe('Create', () => {
        describe('On successful request', () => {
            const testUser: User = {
                username: 'test',
                password: 'test',
                email: 'test@test.com'
            };

            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                userService.create = jest.fn(() => Promise.resolve());
                store = mockStore();

                await store.dispatch<any>(userActions.create(testUser));
            });

            it('Calls the create() service method', () => {
                expect(userService.create).toHaveBeenCalledWith(testUser);
            });

            it('Dispatches request and success actions', () => {
                const expectedActions = [
                    { type: userConstants.CREATE_REQUEST },
                    { type: userConstants.CREATE_SUCCESS }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('On unsuccessful request', () => {
            const testUser: User = {
                username: 'test',
                password: 'test',
                email: 'test@test.com'
            };
            const expectedErrorMessage = 'test';

            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                const error = Error(expectedErrorMessage);
                userService.create = jest.fn(() => Promise.reject(error));
                store = mockStore();

                await store.dispatch<any>(userActions.create(testUser));
            });

            it('Dispatches request and failure actions', () => {
                const expectedActions = [
                    { type: userConstants.CREATE_REQUEST },
                    {
                        type: userConstants.CREATE_FAILURE,
                        error: Error(expectedErrorMessage)
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});

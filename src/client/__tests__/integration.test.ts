import { store } from '../_helpers/store';
import { initialState as userDefaultState } from '../_reducers/users.reducer';
import { initialState as authDefaultState } from '../_reducers/authentication.reducer';
import { userActions, authenticationActions } from '../_actions';
import { userService, authenticationService } from '../_services';
import { User, AuthenticatedUser, AuthenticationState } from '../_interfaces';

describe('Client-side integration tests', () => {
    it('Initializes store with expected default values', () => {
        const expectedState = {
            users: userDefaultState,
            authentication: authDefaultState
        };
        const state = store.getState();
        expect(state).toEqual(expectedState);
    });

    describe('User redux routes [(Dispatch) -> Action Creator -> Service -> Reducer -> Store Update]', () => {
        describe('Action | Create', () => {
            describe('On successful request', () => {
                const testUser: User = {
                    username: 'test',
                    password: 'test',
                    email: 'test@test.com',
                    createdDate: new Date()
                };
                beforeAll(() => {
                    userService.create = jest.fn(() => Promise.resolve());
                    store.dispatch<any>(userActions.create(testUser));
                });

                it('Calls the create() service method with expected parameters', () => {
                    expect(userService.create).toHaveBeenCalledWith(testUser);
                });

                it('Returns the state to default', () => {
                    const { users } = store.getState();
                    expect(users).toEqual(userDefaultState);
                });

                it('Has no side-effects on auth state', () => {
                    const { authentication } = store.getState();
                    expect(authentication).toEqual(authDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                const testMessage = 'test';
                const testUser: User = {
                    username: 'test',
                    password: 'test',
                    email: 'test@test.com',
                    createdDate: new Date()
                };
                beforeAll(() => {
                    userService.create = jest.fn(() =>
                        Promise.reject(Error(testMessage))
                    );
                    store.dispatch<any>(userActions.create(testUser));
                });

                afterAll(() => {
                    // Perform an action that will result in the user state
                    // reverting to default.
                    userService.create = jest.fn(() => Promise.resolve());
                    store.dispatch<any>(userActions.create(testUser));
                    expect(store.getState().users).toEqual(userDefaultState);
                });

                it('Reaches an error state', () => {
                    const { users } = store.getState();
                    const expectedState = {
                        ...userDefaultState,
                        error: Error(testMessage)
                    };
                    expect(users).toEqual(expectedState);
                });
            });
        });
    });

    describe('Authentication redux routes [(Dispatch) -> Action Creator -> Service -> Reducer -> Store Update]', () => {
        describe('Action | Login', () => {
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
                beforeAll(() => {
                    authenticationService.login = jest.fn(
                        (username, password) => Promise.resolve(authedTestUser)
                    );
                    store.dispatch<any>(
                        authenticationActions.login(
                            testUser.username,
                            testUser.password
                        )
                    );
                });

                it('Calles the login() service method with expected parameters', () => {
                    expect(authenticationService.login).toHaveBeenCalledWith(
                        testUser.username,
                        testUser.password
                    );
                });

                it('Returns logged in state with user present', () => {
                    const expectedState: AuthenticationState = {
                        loggingIn: false,
                        loggedIn: true,
                        user: authedTestUser
                    };
                    const { authentication } = store.getState();
                    expect(authentication).toEqual(expectedState);
                });

                it('Has no side-effects on user state', () => {
                    const { users } = store.getState();
                    expect(users).toEqual(userDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                const testMessage = 'test';
                beforeAll(() => {
                    authenticationService.login = jest.fn(() =>
                        Promise.reject(Error(testMessage))
                    );
                    store.dispatch<any>(
                        authenticationActions.login(
                            testUser.username,
                            testUser.password
                        )
                    );
                });

                it('Reaches an error state', () => {
                    const { authentication } = store.getState();
                    const expectedState = {
                        ...authDefaultState,
                        error: Error(testMessage)
                    };
                    expect(authentication).toEqual(expectedState);
                });
            });
        });

        describe('Action | Logout', () => {
            const testUser: User = {
                username: 'test',
                password: 'test',
                email: 'test@test.com',
                createdDate: new Date()
            };
            const authedTestUser: AuthenticatedUser = {
                username: testUser.username,
                email: testUser.email,
                createdDate: testUser.createdDate!,
                token: 'test',
                __v: 0,
                _id: 'testid'
            };

            beforeEach(() => {
                authenticationService.logout = jest.fn();

                // Get store into the logged in state
                authenticationService.login = jest.fn((username, password) =>
                    Promise.resolve(authedTestUser)
                );
                store.dispatch<any>(
                    authenticationActions.login(
                        testUser.username,
                        testUser.password
                    )
                );
            });
            it('Calls logout() method from the service', () => {
                store.dispatch<any>(authenticationActions.logout());
                expect(authenticationService.logout).toHaveBeenCalled();
            });

            it('Removes the currently logged in user from the state', async () => {
                const expectedLoggedInState: AuthenticationState = {
                    loggingIn: false,
                    loggedIn: true,
                    user: authedTestUser
                };
                expect(store.getState().authentication).toEqual(
                    expectedLoggedInState
                );

                // Check that logout action reverts to default state
                await store.dispatch<any>(authenticationActions.logout());
                expect(store.getState().authentication).toEqual(
                    authDefaultState
                );
            });
        });
    });
});

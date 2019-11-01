import mongoose, { mongo } from 'mongoose';
import { store } from '../_helpers/store';
import { initialState as userDefaultState } from '../_reducers/users.reducer';
import { initialState as authDefaultState } from '../_reducers/authentication.reducer';
import { initialState as seriesDefaultState } from '../_reducers/series.reducer';
import { initialState as companyDefaultState } from '../_reducers/company.reducer';
import {
    userActions,
    authenticationActions,
    seriesActions,
    appActions,
    companyActions
} from '../_actions';
import {
    userService,
    authenticationService,
    seriesService,
    companyService
} from '../_services';
import {
    User,
    AuthenticatedUser,
    AuthenticationState,
    SeriesState,
    CompanyState
} from '../_interfaces';
import { Item } from '../_interfaces/item.interface';
import { Series, Company } from '../../lib/interfaces';

describe('Client-side integration tests', () => {
    it('Initializes store with expected default values', () => {
        const expectedState = {
            users: userDefaultState,
            authentication: authDefaultState,
            series: seriesDefaultState,
            companies: companyDefaultState
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

                it('Has no side-effects on other state', () => {
                    const { authentication, series } = store.getState();
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
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

                it('Has no side-effects on other state', () => {
                    const { users, series } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(series).toEqual(seriesDefaultState);
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

    describe('Series redux routes [(Dispatch) -> Action Creator -> Service -> Reducer -> Store Update]', () => {
        const clearSeriesState = () => {
            store.dispatch<any>(appActions.reset);
            expect(store.getState().series).toEqual(seriesDefaultState);
        };

        const testSeries: Series = {
            name: 'test',
            items: ['test', 'test']
        };
        const testId = 'test';
        const testItem: Series & Item = {
            ...testSeries,
            _id: testId
        };
        const testErrorMessage = 'test';

        describe('Action | Create', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    seriesService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(seriesActions.create(testSeries));
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Calls the create() service method with expected parameters', () => {
                    expect(seriesService.create).toHaveBeenCalledWith(
                        testSeries
                    );
                });

                it('Adds series to state correctly', () => {
                    const { series } = store.getState();
                    const expectedState: SeriesState = {
                        ...seriesDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testSeries
                        }
                    };
                    expect(series).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    seriesService.create = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(seriesActions.create(testSeries));
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Reaches an error state', () => {
                    const { series } = store.getState();
                    const expectedState = {
                        ...seriesDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };

                    expect(series).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get All', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    seriesService.getAll = jest.fn(() =>
                        Promise.resolve([testItem])
                    );
                    store.dispatch<any>(seriesActions.getAll());
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Calls the getAll() service method', () => {
                    expect(seriesService.getAll).toHaveBeenCalled();
                });

                it('Adds response to state correctly', () => {
                    const { series } = store.getState();
                    const expectedState: SeriesState = {
                        ...seriesDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testSeries
                        }
                    };
                    expect(series).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    seriesService.getAll = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(seriesActions.getAll());
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Reaches an error state', () => {
                    const { series } = store.getState();
                    const expectedState = {
                        ...seriesDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(series).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get By ID', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    seriesService.getById = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(seriesActions.getById(testId));
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Calls the getById() service method with expected parameters', () => {
                    expect(seriesService.getById).toHaveBeenCalledWith(testId);
                });

                it('Adds the response to state correctly', () => {
                    const { series } = store.getState();
                    const expectedState: SeriesState = {
                        ...seriesDefaultState,
                        selectedSeries: testItem._id
                    };
                    expect(series).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    seriesService.getById = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(seriesActions.getById(testId));
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Reaches an error state', () => {
                    const { series } = store.getState();
                    const expectedState: SeriesState = {
                        ...seriesDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(series).toEqual(expectedState);
                });
            });
        });

        describe('Action | Update', () => {
            const testUpdate: Series = {
                ...testItem,
                items: ['test', 'test', 'update']
            };
            describe('On successful request', () => {
                const expectedUpdate: Series = {
                    ...testSeries,
                    items: testUpdate.items
                };
                beforeAll(() => {
                    seriesService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    seriesService.update = jest.fn(() =>
                        Promise.resolve(testUpdate)
                    );
                    store.dispatch<any>(seriesActions.create(testSeries));
                    store.dispatch<any>(
                        seriesActions.update(testId, testUpdate)
                    );
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Calls the update() service method with expected parameters', () => {
                    expect(seriesService.update).toHaveBeenCalledWith(
                        testId,
                        testUpdate
                    );
                });

                it('Updates the state correctly', () => {
                    const { series } = store.getState();
                    const expectedState: SeriesState = {
                        ...seriesDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: expectedUpdate
                        }
                    };
                    expect(series).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                });
            });

            describe('On unsuccesful requests', () => {
                beforeAll(() => {
                    seriesService.update = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(
                        seriesActions.update(testId, testUpdate)
                    );
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Reaches an error state', () => {
                    const { series } = store.getState();
                    const expectedState = {
                        ...seriesDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(series).toEqual(expectedState);
                });
            });
        });

        describe('Action | Delete', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    seriesService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    seriesService.delete = jest.fn(() => Promise.resolve());
                    store.dispatch<any>(seriesActions.create(testItem));
                    store.dispatch<any>(seriesActions.delete(testItem._id));
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Calls the delete() service method with expected parameters', () => {
                    expect(seriesService.delete).toHaveBeenCalledWith(
                        testItem._id
                    );
                });

                it('Removes the deleted item from state correctly', () => {
                    const { series } = store.getState();
                    const expectedState: SeriesState = {
                        ...seriesDefaultState
                    };
                    expect(series).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    seriesService.delete = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(seriesActions.delete(testId));
                });

                afterAll(() => {
                    clearSeriesState();
                });

                it('Reaches an error state', () => {
                    const { series } = store.getState();
                    const expectedState: SeriesState = {
                        ...seriesDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(series).toEqual(expectedState);
                });
            });
        });
    });

    describe('Company redux routes [(Dispatch) -> Action Creator -> Service -> Reducer -> Store Update]', () => {
        const clearCompanyState = () => {
            store.dispatch<any>(appActions.reset);
        };
        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testCompany: Company = {
            name: 'test',
            titles: [item1, item2]
        };
        const testId = 'test';
        const testItem: Company & Item = {
            ...testCompany,
            _id: testId
        };
        const testErrorMessage = 'test';

        describe('Action | Create', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    companyService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(companyActions.create(testCompany));
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Calls the create() service method with expected parameters', () => {
                    expect(companyService.create).toHaveBeenCalledWith(
                        testCompany
                    );
                });

                it('Adds company to state correctly', () => {
                    const { companies } = store.getState();
                    const expectedState: CompanyState = {
                        ...companyDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testCompany
                        }
                    };
                    expect(companies).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication, series } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    companyService.create = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(companyActions.create(testCompany));
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Reaches an error state', () => {
                    const { companies } = store.getState();
                    const expectedState = {
                        ...companyDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(companies).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get By ID', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    companyService.getById = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(companyActions.getById(testId));
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Calls the getById() service method with expected parameters', () => {
                    expect(companyService.getById).toHaveBeenCalledWith(testId);
                });

                it('Adds the response to state correctly', () => {
                    const { companies } = store.getState();
                    const expectedState: CompanyState = {
                        ...companyDefaultState,
                        selectedCompany: testItem._id
                    };
                    expect(companies).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication, series } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    companyService.getById = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(companyActions.getById(testId));
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Reaches an error state', () => {
                    const { companies } = store.getState();
                    const expectedState: CompanyState = {
                        ...companyDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(companies).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get All', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    companyService.getAll = jest.fn(() =>
                        Promise.resolve([testItem])
                    );
                    store.dispatch<any>(companyActions.getAll());
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Calls the getAll() service method', () => {
                    expect(companyService.getAll).toHaveBeenCalled();
                });

                it('Adds the response to state correctly', () => {
                    const { companies } = store.getState();
                    const expectedState: CompanyState = {
                        ...companyDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testCompany
                        }
                    };
                    expect(companies).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication, series } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    companyService.getAll = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(companyActions.getAll());
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Reaches an error state', () => {
                    const { companies } = store.getState();
                    const expectedState = {
                        ...companyDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(companies).toEqual(expectedState);
                });
            });
        });

        describe('Action | Update', () => {
            const newItem = mongoose.Types.ObjectId().toHexString();
            const testUpdate: Company = {
                ...testItem,
                titles: [...testItem.titles, newItem]
            };

            describe('On successful request', () => {
                const expectedUpdate: Company = {
                    ...testCompany,
                    titles: testUpdate.titles
                };
                beforeAll(() => {
                    companyService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    companyService.update = jest.fn(() =>
                        Promise.resolve(testUpdate)
                    );
                    store.dispatch<any>(companyActions.create(testCompany));
                    store.dispatch<any>(
                        companyActions.update(testId, testUpdate)
                    );
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Calls the update() service method with expected parameters', () => {
                    expect(companyService.update).toHaveBeenCalledWith(
                        testId,
                        testUpdate
                    );
                });

                it('Updates the state correctly', () => {
                    const { companies } = store.getState();
                    const expectedState: CompanyState = {
                        ...companyDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: expectedUpdate
                        }
                    };
                    expect(companies).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication, series } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    companyService.update = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(
                        companyActions.update(testId, testUpdate)
                    );
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Reaches an error state', () => {
                    const { companies } = store.getState();
                    const expectedState = {
                        ...companyDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(companies).toEqual(expectedState);
                });
            });
        });

        describe('Action | Delete', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    companyService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    companyService.delete = jest.fn(() => Promise.resolve());
                    store.dispatch<any>(companyActions.create(testItem));
                    store.dispatch<any>(companyActions.delete(testItem._id));
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Calls the delete() service method with expected parameters', () => {
                    expect(companyService.delete).toHaveBeenCalledWith(
                        testItem._id
                    );
                });

                it('Removes the deleted item from state correctly', () => {
                    const { companies } = store.getState();
                    const expectedState: CompanyState = {
                        ...companyDefaultState
                    };
                    expect(companies).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const { users, authentication, series } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    companyService.delete = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(companyActions.delete(testId));
                });

                afterAll(() => {
                    clearCompanyState();
                });

                it('Reaches an error state', () => {
                    const { companies } = store.getState();
                    const expectedState: CompanyState = {
                        ...companyDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(companies).toEqual(expectedState);
                });
            });
        });
    });
});

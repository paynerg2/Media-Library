import mongoose from 'mongoose';
import { store } from '../_helpers/store';
import { initialState as userDefaultState } from '../_reducers/users.reducer';
import { initialState as authDefaultState } from '../_reducers/authentication.reducer';
import { initialState as seriesDefaultState } from '../_reducers/series.reducer';
import { initialState as companyDefaultState } from '../_reducers/company.reducer';
import { initialState as creatorDefaultState } from '../_reducers/creator.reducer';
import { initialState as discDefaultState } from '../_reducers/disc.reducer';
import { initialState as bookDefaultState } from '../_reducers/book.reducer';
import { initialState as gameDefaultState } from '../_reducers/game.reducer';
import {
    userActions,
    authenticationActions,
    seriesActions,
    appActions,
    companyActions,
    creatorActions,
    bookActions,
    discActions,
    gameActions
} from '../_actions';
import {
    userService,
    authenticationService,
    seriesService,
    companyService,
    creatorService,
    bookService,
    discService,
    gameService
} from '../_services';
import {
    User,
    AuthenticatedUser,
    AuthenticationState,
    SeriesState,
    CompanyState,
    CreatorState,
    BookState,
    DiscState,
    GameState
} from '../_interfaces';
import { MongoId } from '../_interfaces/mongoId.interface';
import {
    Series,
    Company,
    Creator,
    Book,
    Disc,
    Game
} from '../../lib/interfaces';
import { bookTypes, discFormats } from '../../lib/formats';

describe('Client-side integration tests', () => {
    it('Initializes store with expected default values', () => {
        const expectedState = {
            users: userDefaultState,
            authentication: authDefaultState,
            series: seriesDefaultState,
            companies: companyDefaultState,
            creators: creatorDefaultState,
            books: bookDefaultState,
            discs: discDefaultState,
            games: gameDefaultState
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
        const testItem: Series & MongoId = {
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
        const testItem: Company & MongoId = {
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
                    const expectedState: CompanyState = {
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
                    const expectedState: CompanyState = {
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

    describe('Creator redux routes [(Dispatch) -> Action Creator -> Service -> Reducer -> Store Update]', () => {
        const clearCreatorState = () => {
            store.dispatch<any>(appActions.reset);
        };
        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testCreator: Creator = {
            firstName: 'test',
            middleInitials: 'T.',
            lastName: 'tester',
            works: [item1, item2]
        };
        const testId = 'test';
        const testItem: Creator & MongoId = {
            ...testCreator,
            _id: testId
        };
        const testErrorMessage = 'test';

        describe('Action | Create', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    creatorService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(creatorActions.create(testCreator));
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Calls the create() service method with expected parameters', () => {
                    expect(creatorService.create).toHaveBeenCalledWith(
                        testCreator
                    );
                });

                it('Adds creator to state correctly', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testCreator
                        }
                    };
                    expect(creators).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    creatorService.create = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(creatorActions.create(testCreator));
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Reaches an error state', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(creators).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get By ID', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    creatorService.getById = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(creatorActions.getById(testId));
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Calls the getById() service method with expected parameters', () => {
                    expect(creatorService.getById).toHaveBeenCalledWith(testId);
                });

                it('Adds the response to state correctly', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        selectedCreator: testItem._id
                    };
                    expect(creators).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                });
            });

            describe('On unsuccuessful request', () => {
                beforeAll(() => {
                    creatorService.getById = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(creatorActions.getById(testId));
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Reaches an error state', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(creators).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get All', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    creatorService.getAll = jest.fn(() =>
                        Promise.resolve([testItem])
                    );
                    store.dispatch<any>(creatorActions.getAll());
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Calls the getAll() service method', () => {
                    expect(creatorService.getAll).toHaveBeenCalled();
                });

                it('Adds the response to state correctly', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testCreator
                        }
                    };
                    expect(creators).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    creatorService.getAll = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(creatorActions.getAll());
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Reaches an error state', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(creators).toEqual(expectedState);
                });
            });
        });

        describe('Action | Update', () => {
            const newItem = mongoose.Types.ObjectId().toHexString();
            const testUpdate: Creator = {
                ...testItem,
                works: [...testItem.works!, newItem]
            };

            describe('On successful request', () => {
                const expectedUpdate: Creator = {
                    ...testCreator,
                    works: testUpdate.works
                };

                beforeAll(() => {
                    creatorService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    creatorService.update = jest.fn(() =>
                        Promise.resolve(testUpdate)
                    );
                    store.dispatch<any>(creatorActions.create(testCreator));
                    store.dispatch<any>(
                        creatorActions.update(testId, testUpdate)
                    );
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Calls the update() service method with expected parameters', () => {
                    expect(creatorService.update).toHaveBeenCalledWith(
                        testId,
                        testUpdate
                    );
                });

                it('Updates the state correctly', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: expectedUpdate
                        }
                    };
                    expect(creators).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    creatorService.update = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(
                        creatorActions.update(testId, testUpdate)
                    );
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Reaches an error state', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(creators).toEqual(expectedState);
                });
            });
        });

        describe('Action | Delete', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    creatorService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    creatorService.delete = jest.fn(() => Promise.resolve());
                    store.dispatch<any>(creatorActions.create(testItem));
                    store.dispatch<any>(creatorActions.delete(testItem._id));
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Calls the delete() service method with expected parameters', () => {
                    expect(creatorService.delete).toHaveBeenCalledWith(
                        testItem._id
                    );
                });

                it('Removes the deleted item from state correctly', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState
                    };
                    expect(creators).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    creatorService.delete = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(creatorActions.delete(testId));
                });

                afterAll(() => {
                    clearCreatorState();
                });

                it('Reaches an error state', () => {
                    const { creators } = store.getState();
                    const expectedState: CreatorState = {
                        ...creatorDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(creators).toEqual(expectedState);
                });
            });
        });
    });

    describe('Book redux routes [(Dispatch) -> Action Creator -> Service -> Reducer -> Store Update]', () => {
        const clearBookState = () => {
            store.dispatch<any>(appActions.reset);
        };

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testBook: Book = {
            title: 'test',
            authors: [item1, item2],
            artists: [item1],
            colorer: [item1],
            letterer: [item2],
            publisher: item1,
            language: 'test',
            physical: true,
            digital: false,
            checkedOut: true,
            checkedOutBy: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehostedhere.com',
            location: 'test',
            type: bookTypes[0],
            series: item1,
            volume: 3,
            isbn: 'test'
        };
        const testId = mongoose.Types.ObjectId().toHexString();
        const testItem: Book & MongoId = {
            ...testBook,
            _id: testId
        };
        const testErrorMessage = 'test';

        describe('Action | Create', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    bookService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(bookActions.create(testBook));
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Calls the create() service method with expected parameters', () => {
                    expect(bookService.create).toHaveBeenCalledWith(testBook);
                });

                it('Adds book to state correctly', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testBook
                        }
                    };
                    expect(books).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    bookService.create = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(bookActions.create(testBook));
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Reaches an error state', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(books).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get By ID', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    bookService.getById = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(bookActions.getById(testId));
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Calls the getById() service method with expected parameters', () => {
                    expect(bookService.getById).toHaveBeenCalledWith(testId);
                });

                it('Adds the response to state correctly', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        selectedBook: testItem._id
                    };
                    expect(books).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    bookService.getById = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(bookActions.getById(testId));
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Reaches an error state', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(books).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get All', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    bookService.getAll = jest.fn(() =>
                        Promise.resolve([testItem])
                    );
                    store.dispatch<any>(bookActions.getAll());
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Calls the getAll() service method', () => {
                    expect(bookService.getAll).toHaveBeenCalled();
                });

                it('Adds the response to state correctly', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testBook
                        }
                    };
                    expect(books).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    bookService.getAll = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(bookActions.getAll());
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Reaches an error state', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(books).toEqual(expectedState);
                });
            });
        });

        describe('Action | Update', () => {
            const testUpdate: Book = {
                ...testItem,
                checkedOut: !testItem.checkedOut
            };

            describe('On successful request', () => {
                const expectedUpdate: Book = {
                    ...testBook,
                    checkedOut: !testBook.checkedOut
                };

                beforeAll(() => {
                    bookService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    bookService.update = jest.fn(() =>
                        Promise.resolve(testUpdate)
                    );
                    store.dispatch<any>(bookActions.create(testBook));
                    store.dispatch<any>(bookActions.update(testId, testUpdate));
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Calls the update() service method with expected parameters', () => {
                    expect(bookService.update).toHaveBeenCalledWith(
                        testId,
                        testUpdate
                    );
                });

                it('Updates the state correctly', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: expectedUpdate
                        }
                    };
                    expect(books).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    bookService.update = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(bookActions.update(testId, testBook));
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Reaches an error state', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(books).toEqual(expectedState);
                });
            });
        });

        describe('Action | Delete', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    bookService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    bookService.delete = jest.fn(() => Promise.resolve());
                    store.dispatch<any>(bookActions.create(testItem));
                    store.dispatch<any>(bookActions.delete(testItem._id));
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Calls the delete() service method with expected parameters', () => {
                    expect(bookService.delete).toHaveBeenCalledWith(
                        testItem._id
                    );
                });

                it('Removes the deleted item from state correctly', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState
                    };
                    expect(books).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    bookService.delete = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(bookActions.delete(testId));
                });

                afterAll(() => {
                    clearBookState();
                });

                it('Reaches an error state', () => {
                    const { books } = store.getState();
                    const expectedState: BookState = {
                        ...bookDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(books).toEqual(expectedState);
                });
            });
        });
    });

    describe('Disc redux routes [(Dispatch) -> Action Creator -> Service -> Reducer -> Store Update]', () => {
        const clearDiscState = () => {
            store.dispatch<any>(appActions.reset);
        };
        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testDisc: Disc = {
            title: 'test',
            checkedOut: true,
            checkedOutBy: item1,
            physical: true,
            digital: true,
            series: item2,
            publisher: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehost.com',
            location: 'test',
            format: [discFormats[0], discFormats[1]],
            languages: ['English', 'Test'],
            subtitles: ['English', 'Test'],
            volume: 3,
            studio: item2,
            isCollection: false
        };
        const testId = mongoose.Types.ObjectId().toHexString();
        const testItem: Disc & MongoId = {
            ...testDisc,
            _id: testId
        };
        const testErrorMessage = 'test';

        describe('Action | Create', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    discService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(discActions.create(testDisc));
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Calls the create() service method with expected parameters', () => {
                    expect(discService.create).toHaveBeenCalledWith(testDisc);
                });

                it('Adds disc to state correctly', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testDisc
                        }
                    };
                    expect(discs).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    discService.create = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(discActions.create(testDisc));
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Reaches an error state', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(discs).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get By ID', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    discService.getById = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(discActions.getById(testId));
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Calls the getById() service method with expected parameters', () => {
                    expect(discService.getById).toHaveBeenCalledWith(testId);
                });

                it('Adds the response to state correctly', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        selectedDisc: testItem._id
                    };
                    expect(discs).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    discService.getById = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(discActions.getById(testId));
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Reaches an error state', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(discs).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get All', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    discService.getAll = jest.fn(() =>
                        Promise.resolve([testItem])
                    );
                    store.dispatch<any>(discActions.getAll());
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Calls the getAll() service method', () => {
                    expect(discService.getAll).toHaveBeenCalled();
                });

                it('Adds the response to state correctly', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testDisc
                        }
                    };
                    expect(discs).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    discService.getAll = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(discActions.getAll());
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Reaches an error state', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(discs).toEqual(expectedState);
                });
            });
        });

        describe('Action | Update', () => {
            const testUpdate: Disc = {
                ...testItem,
                checkedOut: !testItem.checkedOut
            };

            describe('On successful request', () => {
                const expectedUpdate: Disc = {
                    ...testDisc,
                    checkedOut: !testDisc.checkedOut
                };

                beforeAll(() => {
                    discService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    discService.update = jest.fn(() =>
                        Promise.resolve(testUpdate)
                    );
                    store.dispatch<any>(discActions.create(testDisc));
                    store.dispatch<any>(discActions.update(testId, testUpdate));
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Calls the update() service method with expected parameters', () => {
                    expect(discService.update).toHaveBeenCalledWith(
                        testId,
                        testUpdate
                    );
                });

                it('Updates the state correctly', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: expectedUpdate
                        }
                    };
                    expect(discs).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    discService.update = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(discActions.update(testId, testDisc));
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Reaches an error state', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(discs).toEqual(expectedState);
                });
            });
        });

        describe('Action | Delete', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    discService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    discService.delete = jest.fn(() => Promise.resolve());
                    store.dispatch<any>(discActions.create(testItem));
                    store.dispatch<any>(discActions.delete(testItem._id));
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Calls the delete() service method with expected parameters', () => {
                    expect(discService.delete).toHaveBeenCalledWith(
                        testItem._id
                    );
                });

                it('Removes the deleted item from state correctly', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState
                    };
                    expect(discs).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    discService.delete = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(discActions.delete(testId));
                });

                afterAll(() => {
                    clearDiscState();
                });

                it('Reaches an error state', () => {
                    const { discs } = store.getState();
                    const expectedState: DiscState = {
                        ...discDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(discs).toEqual(expectedState);
                });
            });
        });
    });

    describe('Game redux routes [(Dispatch) -> Action Creator -> Service -> Reducer -> Store Update]', () => {
        const clearGameState = () => {
            store.dispatch<any>(appActions.reset);
        };
        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testGame: Game = {
            title: 'test',
            checkedOut: true,
            checkedOutBy: item1,
            physical: true,
            digital: true,
            series: item2,
            publisher: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehost.com',
            location: 'test',
            platforms: [item1, item2],
            languages: ['English', 'Test'],
            multiplayer: true,
            genre: 'test'
        };
        const testId = mongoose.Types.ObjectId().toHexString();
        const testItem: Game & MongoId = {
            ...testGame,
            _id: testId
        };
        const testErrorMessage = 'test';

        describe('Action | Create', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    gameService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(gameActions.create(testGame));
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Calls the create() service method with expected parameters', () => {
                    expect(gameService.create).toHaveBeenCalledWith(testGame);
                });

                it('Adds disc to state correctly', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testGame
                        }
                    };
                    expect(games).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books,
                        discs
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                    expect(discs).toEqual(discDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    gameService.create = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(gameActions.create(testGame));
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Reaches an error state', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(games).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get By ID', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    gameService.getById = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    store.dispatch<any>(gameActions.getById(testId));
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Calls the getById() service method with expected parameters', () => {
                    expect(gameService.getById).toHaveBeenCalledWith(testId);
                });

                it('Adds the response to state correctly', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        selectedGame: testItem._id
                    };
                    expect(games).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books,
                        discs
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                    expect(discs).toEqual(discDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    gameService.getById = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(gameActions.getById(testId));
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Reaches an error state', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(games).toEqual(expectedState);
                });
            });
        });

        describe('Action | Get All', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    gameService.getAll = jest.fn(() =>
                        Promise.resolve([testItem])
                    );
                    store.dispatch<any>(gameActions.getAll());
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Calls the getAll() service method', () => {
                    expect(gameService.getAll).toHaveBeenCalled();
                });

                it('Adds the response to state correctly', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: testGame
                        }
                    };
                    expect(games).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books,
                        discs
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                    expect(discs).toEqual(discDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    gameService.getAll = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(gameActions.getAll());
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Reaches an error state', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(games).toEqual(expectedState);
                });
            });
        });

        describe('Action | Update', () => {
            const testUpdate: Game = {
                ...testItem,
                checkedOut: !testItem.checkedOut
            };

            describe('On successful request', () => {
                const expectedUpdate: Game = {
                    ...testGame,
                    checkedOut: !testGame.checkedOut
                };

                beforeAll(() => {
                    gameService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    gameService.update = jest.fn(() =>
                        Promise.resolve(testUpdate)
                    );
                    store.dispatch<any>(gameActions.create(testGame));
                    store.dispatch<any>(gameActions.update(testId, testUpdate));
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Calls the update() service method with expected parameters', () => {
                    expect(gameService.update).toHaveBeenCalledWith(
                        testId,
                        testUpdate
                    );
                });

                it('Updates the state correctly', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        allIds: [testItem._id],
                        byId: {
                            [testItem._id]: expectedUpdate
                        }
                    };
                    expect(games).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books,
                        discs
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                    expect(discs).toEqual(discDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    gameService.update = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(gameActions.update(testId, testGame));
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Reaches an error state', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(games).toEqual(expectedState);
                });
            });
        });

        describe('Action | Delete', () => {
            describe('On successful request', () => {
                beforeAll(() => {
                    gameService.create = jest.fn(() =>
                        Promise.resolve(testItem)
                    );
                    gameService.delete = jest.fn(() => Promise.resolve());
                    store.dispatch<any>(gameActions.create(testItem));
                    store.dispatch<any>(gameActions.delete(testItem._id));
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Calls the delete() service method with expected parameters', () => {
                    expect(gameService.delete).toHaveBeenCalledWith(
                        testItem._id
                    );
                });

                it('Removes the deleted item from state correctly', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState
                    };
                    expect(games).toEqual(expectedState);
                });

                it('Has no side-effects on other state', () => {
                    const {
                        users,
                        authentication,
                        series,
                        companies,
                        creators,
                        books,
                        discs
                    } = store.getState();
                    expect(users).toEqual(userDefaultState);
                    expect(authentication).toEqual(authDefaultState);
                    expect(series).toEqual(seriesDefaultState);
                    expect(companies).toEqual(companyDefaultState);
                    expect(creators).toEqual(creatorDefaultState);
                    expect(books).toEqual(bookDefaultState);
                    expect(discs).toEqual(discDefaultState);
                });
            });

            describe('On unsuccessful request', () => {
                beforeAll(() => {
                    gameService.delete = jest.fn(() =>
                        Promise.reject(Error(testErrorMessage))
                    );
                    store.dispatch<any>(gameActions.delete(testId));
                });

                afterAll(() => {
                    clearGameState();
                });

                it('Reaches an error state', () => {
                    const { games } = store.getState();
                    const expectedState: GameState = {
                        ...gameDefaultState,
                        loading: true,
                        error: Error(testErrorMessage)
                    };
                    expect(games).toEqual(expectedState);
                });
            });
        });
    });
});

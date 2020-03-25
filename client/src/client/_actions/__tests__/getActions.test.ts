import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import {
    mockInterface,
    mockActionTypes,
    mockService
} from '../../_helpers/_mocks';
import { getActions } from '../getActions';

const mockStore = configureMockStore([thunkMiddleware]);

describe('Action Factory', () => {
    const testErrorMessage = 'test';
    const testItem: mockInterface = {
        property: 'test',
        property2: 616
    };
    const testId = 'test';

    const actions = getActions<mockInterface>(mockService, mockActionTypes);

    describe('Create', () => {
        describe('On successful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                mockService.create = jest.fn(() => Promise.resolve(testItem));
                store = mockStore();

                await store.dispatch<any>(actions.create(testItem));
            });

            it('Calls the create() service method with expected parameters', () => {
                expect(mockService.create).toHaveBeenCalledWith(testItem);
            });

            it('Dispatches request and success actions', () => {
                const expectedActions = [
                    { type: mockActionTypes.CREATE_REQUEST },
                    { type: mockActionTypes.CREATE_SUCCESS, payload: testItem }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('On unsuccessful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;

            beforeEach(async () => {
                mockService.create = jest.fn(() =>
                    Promise.reject(Error(testErrorMessage))
                );
                store = mockStore();

                await store.dispatch<any>(actions.create(testItem));
            });

            it('Dispatches request and failure actions', () => {
                const expectedActions = [
                    { type: mockActionTypes.CREATE_REQUEST },
                    {
                        type: mockActionTypes.CREATE_FAILURE,
                        error: Error(testErrorMessage)
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe('Get All', () => {
        const testItems: mockInterface[] = [testItem, testItem];

        describe('On successful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                mockService.getAll = jest.fn(() => Promise.resolve(testItems));
                store = mockStore();

                await store.dispatch<any>(actions.getAll());
            });

            it('Calls the getAll() service method with expected parameters', () => {
                expect(mockService.getAll).toHaveBeenCalled();
            });

            it('Dispatches request and success actions', () => {
                const expectedActions = [
                    { type: mockActionTypes.GET_REQUEST },
                    { type: mockActionTypes.GET_SUCCESS, payload: testItems }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('On unsuccessful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;

            beforeEach(async () => {
                mockService.getAll = jest.fn(() =>
                    Promise.reject(Error(testErrorMessage))
                );
                store = mockStore();

                await store.dispatch<any>(actions.getAll());
            });

            it('Dispatches request and failure actions', () => {
                const expectedActions = [
                    { type: mockActionTypes.GET_REQUEST },
                    {
                        type: mockActionTypes.GET_FAILURE,
                        error: Error(testErrorMessage)
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe('Get By ID', () => {
        describe('On successful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                mockService.getById = jest.fn(() => Promise.resolve(testItem));
                store = mockStore();

                await store.dispatch<any>(actions.getById(testId));
            });

            it('Calls the getById() service method with expectd parameters', () => {
                expect(mockService.getById).toHaveBeenCalledWith(testId);
            });

            it('Dispatches request and success actions', () => {
                const expectedActions = [
                    { type: mockActionTypes.GET_BY_ID_REQUEST },
                    {
                        type: mockActionTypes.GET_BY_ID_SUCCESS,
                        payload: testItem
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('On unsuccessful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;

            beforeEach(async () => {
                mockService.getById = jest.fn(() =>
                    Promise.reject(Error(testErrorMessage))
                );
                store = mockStore();

                await store.dispatch<any>(actions.getById(testId));
            });

            it('Dispatches request and failure action', () => {
                const expectedActions = [
                    { type: mockActionTypes.GET_BY_ID_REQUEST },
                    {
                        type: mockActionTypes.GET_BY_ID_FAILURE,
                        error: Error(testErrorMessage)
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe('Update', () => {
        describe('On successful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                mockService.update = jest.fn(() => Promise.resolve(testItem));
                store = mockStore();

                await store.dispatch<any>(actions.update(testId, testItem));
            });

            it('Calls the update() service method with expected parameters', () => {
                expect(mockService.update).toHaveBeenCalledWith(
                    testId,
                    testItem
                );
            });

            it('Dispatches request and success actions', () => {
                const expectedActions = [
                    { type: mockActionTypes.UPDATE_REQUEST },
                    { type: mockActionTypes.UPDATE_SUCCESS, payload: testItem }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('On unsuccessful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;

            beforeEach(async () => {
                mockService.update = jest.fn(() =>
                    Promise.reject(Error(testErrorMessage))
                );
                store = mockStore();

                await store.dispatch<any>(actions.update(testId, testItem));
            });

            it('Dispatches request and failure actions', () => {
                const expectedActions = [
                    { type: mockActionTypes.UPDATE_REQUEST },
                    {
                        type: mockActionTypes.UPDATE_FAILURE,
                        error: Error(testErrorMessage)
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe('Delete', () => {
        describe('On successful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                mockService.delete = jest.fn(() => Promise.resolve());
                store = mockStore();

                await store.dispatch<any>(actions.delete(testId));
            });

            it('Calls the delete() service method with expected parameters', () => {
                expect(mockService.delete).toHaveBeenCalledWith(testId);
            });

            it('Dispatches request and success action', () => {
                const expectedActions = [
                    { type: mockActionTypes.DELETE_REQUEST },
                    { type: mockActionTypes.DELETE_SUCCESS, payload: testId }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('On unsuccessful request', () => {
            let store: MockStoreEnhanced<unknown, {}>;
            beforeEach(async () => {
                mockService.delete = jest.fn(() =>
                    Promise.reject(Error(testErrorMessage))
                );
                store = mockStore();

                await store.dispatch<any>(actions.delete(testId));
            });

            it('Dispatches request and failure actions', () => {
                const expectedActions = [
                    { type: mockActionTypes.DELETE_REQUEST },
                    {
                        type: mockActionTypes.DELETE_FAILURE,
                        error: Error(testErrorMessage)
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});

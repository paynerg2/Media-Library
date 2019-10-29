import { series } from '../series.reducer';
import { seriesConstants } from '../../_constants';
import { SeriesState, IAction } from '../../_interfaces';
import { Item } from '../../_interfaces/item.interface';
import { Series } from '../../../lib/interfaces';

describe('Series Reducer', () => {
    const testErrorMessage = 'test';
    const testSeries: Series = {
        name: 'test',
        items: ['test', 'test']
    };
    const testItem: Series & Item = {
        ...testSeries,
        _id: 'test'
    };
    const testItem2: Series & Item = {
        ...testSeries,
        _id: 'test2'
    };
    const initialState: SeriesState = {
        allIds: [],
        byId: {},
        selectedSeries: null,
        loading: false,
        error: undefined
    };
    const requestState: SeriesState = {
        ...initialState,
        loading: true
    };

    describe('When no action present', () => {
        it('Returns default state if no initial state is present', () => {
            const defaultState: SeriesState = initialState;
            expect(series(undefined, {} as IAction)).toEqual(defaultState);
        });

        it('Returns state', () => {
            expect(series(initialState, {} as IAction)).toEqual(initialState);
        });
    });

    describe('Request actions', () => {
        it('Handles requests by entering a loading state', () => {
            const requestActions = [
                {
                    type: seriesConstants.CREATE_REQUEST
                },
                { type: seriesConstants.GET_REQUEST },
                { type: seriesConstants.GET_BY_ID_REQUEST },
                { type: seriesConstants.UPDATE_REQUEST },
                { type: seriesConstants.DELETE_REQUEST }
            ];
            requestActions.forEach(action => {
                expect(series(initialState, action)).toEqual(requestState);
            });
        });
    });

    describe('Failure actions', () => {
        it('Handles failure by setting an error state', () => {
            const failureActions = [
                {
                    type: seriesConstants.CREATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: seriesConstants.GET_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: seriesConstants.GET_BY_ID_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: seriesConstants.UPDATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: seriesConstants.DELETE_FAILURE,
                    error: Error(testErrorMessage)
                }
            ];
            const expectedState: SeriesState = {
                ...initialState,
                error: Error(testErrorMessage)
            };
            failureActions.forEach(action => {
                expect(series(initialState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Success actions', () => {
        describe('Create', () => {
            const action: IAction = {
                type: seriesConstants.CREATE_SUCCESS,
                payload: testItem
            };
            it('Adds the item correctly to state', () => {
                const expectedState: SeriesState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testSeries
                    },
                    allIds: [testItem._id]
                };
                expect(series(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Get All', () => {
            const action: IAction = {
                type: seriesConstants.GET_SUCCESS,
                payload: [testItem, testItem2]
            };
            it('Adds items correctly to state', () => {
                const expectedState: SeriesState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testSeries,
                        [testItem2._id]: testSeries
                    },
                    allIds: [testItem._id, testItem2._id]
                };
                expect(series(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Get By Id', () => {
            it('Correctly adds returned id to selectedSeries in state', () => {
                const action: IAction = {
                    type: seriesConstants.GET_BY_ID_SUCCESS,
                    payload: testItem
                };
                const expectedState: SeriesState = {
                    ...requestState,
                    loading: false,
                    selectedSeries: testItem._id
                };
                expect(series(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Update', () => {
            const testUpdate: Series & Item = {
                _id: testItem._id,
                name: testItem.name,
                items: [...testItem.items, 'update']
            };
            const { _id, ...testUpdatedSeries } = testUpdate;
            const action: IAction = {
                type: seriesConstants.UPDATE_SUCCESS,
                payload: testUpdate
            };
            const preUpdateState = {
                ...requestState,
                byId: {
                    [testItem._id]: testSeries
                },
                allIds: [testItem._id]
            };
            const expectedState: SeriesState = {
                ...preUpdateState,
                byId: {
                    [testUpdate._id]: testUpdatedSeries as Series
                }
            };
            expect(series(preUpdateState, action)).toEqual(expectedState);
        });

        describe('Delete', () => {
            const action = {
                type: seriesConstants.DELETE_SUCCESS,
                payload: testItem._id
            };
            const preDeleteState = {
                ...requestState,
                byId: {
                    [testItem._id]: testSeries
                },
                allIds: [testItem._id]
            };
            const expectedState = {
                ...preDeleteState,
                byId: {},
                allIds: []
            };
            expect(series(preDeleteState, action)).toEqual(expectedState);
        });
    });
});

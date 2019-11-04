import mongoose from 'mongoose';
import { creators, initialState } from '../creator.reducer';
import { creatorConstants } from '../../_constants';
import { CreatorState, IAction } from '../../_interfaces';
import { Item } from '../../_interfaces';
import { Creator } from '../../../lib/interfaces';

describe('Creators Reducer', () => {
    const testErrorMessage = 'test';
    const item1 = mongoose.Types.ObjectId().toHexString();
    const item2 = mongoose.Types.ObjectId().toHexString();
    const testCreator: Creator = {
        firstName: 'test',
        middleInitials: 'T.',
        lastName: 'tester',
        works: [item1, item2]
    };
    const testItem: Creator & Item = {
        ...testCreator,
        _id: mongoose.Types.ObjectId().toHexString()
    };
    const testItem2: Creator & Item = {
        ...testCreator,
        _id: mongoose.Types.ObjectId().toHexString()
    };
    const requestState: CreatorState = {
        ...initialState,
        loading: true
    };

    describe('When no action present', () => {
        it('Returns default state if no initial state is present', () => {
            expect(creators(undefined, {} as IAction)).toEqual(initialState);
        });

        it('Returns state', () => {
            expect(creators(requestState, {} as IAction)).toEqual(requestState);
        });
    });

    describe('Request Actions', () => {
        it('Handles requests by enterting a loading state', () => {
            const requestActions = [
                {
                    type: creatorConstants.CREATE_REQUEST
                },
                { type: creatorConstants.GET_REQUEST },
                { type: creatorConstants.GET_BY_ID_REQUEST },
                { type: creatorConstants.UPDATE_REQUEST },
                { type: creatorConstants.DELETE_REQUEST }
            ];
            requestActions.forEach(action => {
                expect(creators(initialState, action)).toEqual(requestState);
            });
        });
    });

    describe('Failure actions', () => {
        it('Handles failure by setting an error state', () => {
            const failureActions = [
                {
                    type: creatorConstants.CREATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: creatorConstants.GET_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: creatorConstants.GET_BY_ID_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: creatorConstants.UPDATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: creatorConstants.DELETE_FAILURE,
                    error: Error(testErrorMessage)
                }
            ];

            const expectedState: CreatorState = {
                ...initialState,
                error: Error(testErrorMessage)
            };
            failureActions.forEach(action => {
                expect(creators(initialState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Success actions', () => {
        describe('Create', () => {
            const action: IAction = {
                type: creatorConstants.CREATE_SUCCESS,
                payload: testItem
            };
            it('Adds the item correctly to state', () => {
                const expectedState: CreatorState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testCreator
                    },
                    allIds: [testItem._id]
                };
                expect(creators(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Get All', () => {
            const action: IAction = {
                type: creatorConstants.GET_SUCCESS,
                payload: [testItem, testItem2]
            };
            it('Adds the items correctly to state', () => {
                const expectedState: CreatorState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testCreator,
                        [testItem2._id]: testCreator
                    },
                    allIds: [testItem._id, testItem2._id]
                };
                expect(creators(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Get By Id', () => {
            it('Correctly adds returned id to the selectedCreator in state', () => {
                const action: IAction = {
                    type: creatorConstants.GET_BY_ID_SUCCESS,
                    payload: testItem
                };
                const expectedState: CreatorState = {
                    ...requestState,
                    loading: false,
                    selectedCreator: testItem._id
                };
                expect(creators(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Update', () => {
            it('Correctly updates a creator', () => {
                const testUpdate: Creator & Item = {
                    ...testItem,
                    works: [
                        ...testItem.works!,
                        mongoose.Types.ObjectId().toHexString()
                    ]
                };
                const { _id, ...testCreatorUpdate } = testUpdate;
                const action: IAction = {
                    type: creatorConstants.UPDATE_SUCCESS,
                    payload: testUpdate
                };
                const preUpdateState = {
                    ...requestState,
                    byId: {
                        [testItem._id]: testCreator
                    },
                    allIds: [testItem._id]
                };
                const expectedState: CreatorState = {
                    ...preUpdateState,
                    byId: {
                        [testUpdate._id]: testCreatorUpdate as Creator
                    },
                    loading: false
                };
                expect(creators(preUpdateState, action)).toEqual(expectedState);
            });
        });

        describe('Delete', () => {
            it('Correctly removes a creator from state', () => {
                const action = {
                    type: creatorConstants.DELETE_SUCCESS,
                    payload: testItem._id
                };
                const id = mongoose.Types.ObjectId().toHexString();
                const preDeleteState: CreatorState = {
                    ...requestState,
                    byId: {
                        [testItem._id]: testCreator,
                        [id]: testCreator
                    },
                    allIds: [testItem._id, id]
                };
                const expectedState = {
                    ...preDeleteState,
                    byId: { [id]: testCreator },
                    allIds: [id],
                    loading: false
                };
                expect(creators(preDeleteState, action)).toEqual(expectedState);
            });
        });
    });
});

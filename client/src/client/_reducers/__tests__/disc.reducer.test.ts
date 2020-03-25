import mongoose from 'mongoose';
import { discs, initialState } from '../disc.reducer';
import { discConstants } from '../../_constants';
import { DiscState, IAction, MongoId } from '../../_interfaces';
import { Disc } from '../../../lib/interfaces';
import { discFormats } from '../../../lib/formats';

describe('Discs Reducer', () => {
    const testErrorMessage = 'test';
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
    const testItemId = mongoose.Types.ObjectId().toHexString();
    const testItem2Id = mongoose.Types.ObjectId().toHexString();
    const testItem: Disc & MongoId = {
        ...testDisc,
        _id: testItemId
    };
    const testItem2: Disc & MongoId = {
        ...testDisc,
        _id: testItem2Id
    };
    const requestState: DiscState = {
        ...initialState,
        loading: true
    };

    describe('When no action present', () => {
        it('Returns default state if no initial state is present', () => {
            expect(discs(undefined, {} as IAction)).toEqual(initialState);
        });

        it('Returns state', () => {
            expect(discs(requestState, {} as IAction)).toEqual(requestState);
        });
    });

    describe('Request Actions', () => {
        it('Handles requests by entering a loading state', () => {
            const requestActions = [
                {
                    type: discConstants.CREATE_REQUEST
                },
                { type: discConstants.GET_REQUEST },
                { type: discConstants.GET_BY_ID_REQUEST },
                { type: discConstants.UPDATE_REQUEST },
                { type: discConstants.DELETE_REQUEST }
            ];
            requestActions.forEach(action => {
                expect(discs(initialState, action)).toEqual(requestState);
            });
        });
    });

    describe('Failure Actions', () => {
        it('Handles failure by setting an error state', () => {
            const failureActions = [
                {
                    type: discConstants.CREATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: discConstants.GET_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: discConstants.GET_BY_ID_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: discConstants.UPDATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: discConstants.DELETE_FAILURE,
                    error: Error(testErrorMessage)
                }
            ];
            const expectedState: DiscState = {
                ...initialState,
                error: Error(testErrorMessage)
            };
            failureActions.forEach(action => {
                expect(discs(initialState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Success Actions', () => {
        describe('Create', () => {
            const action: IAction = {
                type: discConstants.CREATE_SUCCESS,
                payload: testItem
            };
            it('Adds the item correctly to state', () => {
                const expectedState: DiscState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testItem
                    },
                    allIds: [testItem._id]
                };
                expect(discs(requestState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Get All', () => {
        const action: IAction = {
            type: discConstants.GET_SUCCESS,
            payload: [testItem, testItem2]
        };
        it('Adds items correctly to state', () => {
            const expectedState: DiscState = {
                ...requestState,
                loading: false,
                byId: {
                    [testItem._id]: testItem,
                    [testItem2._id]: testItem2
                },
                allIds: [testItem._id, testItem2._id]
            };
            expect(discs(requestState, action)).toEqual(expectedState);
        });
    });

    describe('Get By Id', () => {
        it('Correctly adds returned id to selectedCompany in state', () => {
            const action: IAction = {
                type: discConstants.GET_BY_ID_SUCCESS,
                payload: testItem
            };
            const expectedState: DiscState = {
                ...requestState,
                loading: false,
                selectedDisc: testItem._id
            };
            expect(discs(requestState, action)).toEqual(expectedState);
        });
    });

    describe('Update', () => {
        it('Correctly updates a company', async () => {
            const testUpdate: Disc & MongoId = {
                ...testItem,
                checkedOut: !testItem.checkedOut
            };
            const action: IAction = {
                type: discConstants.UPDATE_SUCCESS,
                payload: testUpdate
            };
            const preUpdateState: DiscState = {
                ...requestState,
                byId: {
                    [testItem._id]: testItem
                },
                allIds: [testItem._id]
            };
            const expectedState: DiscState = {
                ...preUpdateState,
                byId: {
                    [testUpdate._id]: testUpdate
                },
                loading: false
            };
            expect(discs(preUpdateState, action)).toEqual(expectedState);
        });
    });

    describe('Delete', () => {
        it('Correctly removes a company from state', () => {
            const action = {
                type: discConstants.DELETE_SUCCESS,
                payload: testItem2._id
            };
            const preDeleteState: DiscState = {
                ...requestState,
                byId: {
                    [testItem._id]: testItem,
                    [testItem2._id]: testItem2
                },
                allIds: [testItem._id, testItem2._id]
            };
            const expectedState: DiscState = {
                ...preDeleteState,
                byId: { [testItem._id]: testItem },
                allIds: [testItem._id],
                loading: false
            };
            expect(discs(preDeleteState, action)).toEqual(expectedState);
        });
    });
});

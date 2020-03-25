import mongoose from 'mongoose';
import { books, initialState } from '../book.reducer';
import { bookConstants } from '../../_constants';
import { BookState, IAction, MongoId } from '../../_interfaces';
import { Book } from '../../../lib/interfaces';
import { bookTypes } from '../../../lib/formats';

describe('Books Reducer', () => {
    const testErrorMessage = 'test';
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
    const testItemId = mongoose.Types.ObjectId().toHexString();
    const testItem2Id = mongoose.Types.ObjectId().toHexString();
    const testItem: Book & MongoId = {
        ...testBook,
        _id: testItemId
    };
    const testItem2: Book & MongoId = {
        ...testBook,
        _id: testItem2Id
    };
    const requestState: BookState = {
        ...initialState,
        loading: true
    };

    describe('When no action present', () => {
        it('Returns default state if no initial state is present', () => {
            expect(books(undefined, {} as IAction)).toEqual(initialState);
        });

        it('Returns state', () => {
            expect(books(requestState, {} as IAction)).toEqual(requestState);
        });
    });

    describe('Request Actions', () => {
        it('Handles requests by entering a loading state', () => {
            const requestActions = [
                {
                    type: bookConstants.CREATE_REQUEST
                },
                { type: bookConstants.GET_REQUEST },
                { type: bookConstants.GET_BY_ID_REQUEST },
                { type: bookConstants.UPDATE_REQUEST },
                { type: bookConstants.DELETE_REQUEST }
            ];
            requestActions.forEach(action => {
                expect(books(initialState, action)).toEqual(requestState);
            });
        });
    });

    describe('Failure Actions', () => {
        it('Handles failure by setting an error state', () => {
            const failureActions = [
                {
                    type: bookConstants.CREATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: bookConstants.GET_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: bookConstants.GET_BY_ID_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: bookConstants.UPDATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: bookConstants.DELETE_FAILURE,
                    error: Error(testErrorMessage)
                }
            ];
            const expectedState: BookState = {
                ...initialState,
                error: Error(testErrorMessage)
            };
            failureActions.forEach(action => {
                expect(books(initialState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Success Actions', () => {
        describe('Create', () => {
            const action: IAction = {
                type: bookConstants.CREATE_SUCCESS,
                payload: testItem
            };
            it('Adds the item correctly to state', () => {
                const expectedState: BookState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testItem
                    },
                    allIds: [testItem._id]
                };
                expect(books(requestState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Get All', () => {
        const action: IAction = {
            type: bookConstants.GET_SUCCESS,
            payload: [testItem, testItem2]
        };
        it('Adds items correctly to state', () => {
            const expectedState: BookState = {
                ...requestState,
                loading: false,
                byId: {
                    [testItem._id]: testItem,
                    [testItem2._id]: testItem2
                },
                allIds: [testItem._id, testItem2._id]
            };
            expect(books(requestState, action)).toEqual(expectedState);
        });
    });

    describe('Get By Id', () => {
        it('Correctly adds returned id to selectedCompany in state', () => {
            const action: IAction = {
                type: bookConstants.GET_BY_ID_SUCCESS,
                payload: testItem
            };
            const expectedState: BookState = {
                ...requestState,
                loading: false,
                selectedBook: testItem._id
            };
            expect(books(requestState, action)).toEqual(expectedState);
        });
    });

    describe('Update', () => {
        it('Correctly updates a company', async () => {
            const testUpdate: Book & MongoId = {
                ...testItem,
                checkedOut: !testItem.checkedOut
            };
            const action: IAction = {
                type: bookConstants.UPDATE_SUCCESS,
                payload: testUpdate
            };
            const preUpdateState: BookState = {
                ...requestState,
                byId: {
                    [testItem._id]: testItem
                },
                allIds: [testItem._id]
            };
            const expectedState: BookState = {
                ...preUpdateState,
                byId: {
                    [testUpdate._id]: testUpdate
                },
                loading: false
            };
            expect(books(preUpdateState, action)).toEqual(expectedState);
        });
    });

    describe('Delete', () => {
        it('Correctly removes a company from state', () => {
            const action = {
                type: bookConstants.DELETE_SUCCESS,
                payload: testItem2._id
            };
            const preDeleteState: BookState = {
                ...requestState,
                byId: {
                    [testItem._id]: testItem,
                    [testItem2._id]: testItem2
                },
                allIds: [testItem._id, testItem2._id]
            };
            const expectedState: BookState = {
                ...preDeleteState,
                byId: { [testItem._id]: testItem },
                allIds: [testItem._id],
                loading: false
            };
            expect(books(preDeleteState, action)).toEqual(expectedState);
        });
    });
});

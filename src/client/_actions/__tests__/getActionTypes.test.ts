import { getActionTypes } from '../getActionTypes';
import { mockActionTypes, mockInterface } from '../../_helpers/_mocks';
import { MongoId } from '../../_interfaces/mongoId.interface';

describe('Get Action Types Helper', () => {
    const payload: mockInterface & MongoId = {
        _id: 'test',
        property: 'test',
        property2: 616
    };
    const testId = 'test';
    const testError = Error('test');

    const actionTypes = getActionTypes<mockInterface>(mockActionTypes);

    describe('Action Types | Create', () => {
        it('Returns the expected object for each action type', () => {
            const action = actionTypes.create;
            expect(action.success(payload)).toEqual({
                type: mockActionTypes.CREATE_SUCCESS,
                payload
            });
            expect(action.failure(testError)).toEqual({
                type: mockActionTypes.CREATE_FAILURE,
                error: testError
            });
            expect(action.request()).toEqual({
                type: mockActionTypes.CREATE_REQUEST
            });
        });
    });

    describe('Action Types | Get All', () => {
        it('Returns the expected object for each type', () => {
            const action = actionTypes.getAll;
            expect(action.request()).toEqual({
                type: mockActionTypes.GET_REQUEST
            });
            expect(action.success([payload])).toEqual({
                type: mockActionTypes.GET_SUCCESS,
                payload: [payload]
            });
            expect(action.failure(testError)).toEqual({
                type: mockActionTypes.GET_FAILURE,
                error: testError
            });
        });
    });

    describe('Action Types | Get By ID', () => {
        it('Returns the expected object for each type', () => {
            const action = actionTypes.getById;
            expect(action.request()).toEqual({
                type: mockActionTypes.GET_BY_ID_REQUEST
            });
            expect(action.success(payload)).toEqual({
                type: mockActionTypes.GET_BY_ID_SUCCESS,
                payload
            });
            expect(action.failure(testError)).toEqual({
                type: mockActionTypes.GET_BY_ID_FAILURE,
                error: testError
            });
        });
    });

    describe('Action Types | Update', () => {
        it('Returns the expected obect for each type', () => {
            const action = actionTypes.update;
            expect(action.request()).toEqual({
                type: mockActionTypes.UPDATE_REQUEST
            });
            expect(action.success(payload)).toEqual({
                type: mockActionTypes.UPDATE_SUCCESS,
                payload
            });
            expect(action.failure(testError)).toEqual({
                type: mockActionTypes.UPDATE_FAILURE,
                error: testError
            });
        });
    });

    describe('Action Types | Delete', () => {
        it('Returns the expected object for each type', () => {
            const action = actionTypes._delete;
            expect(action.request()).toEqual({
                type: mockActionTypes.DELETE_REQUEST
            });
            expect(action.success(testId)).toEqual({
                type: mockActionTypes.DELETE_SUCCESS,
                payload: testId
            });
            expect(action.failure(testError)).toEqual({
                type: mockActionTypes.DELETE_FAILURE,
                error: testError
            });
        });
    });
});

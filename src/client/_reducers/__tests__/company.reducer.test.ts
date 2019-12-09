import mongoose from 'mongoose';
import { companies, initialState } from '../company.reducer';
import { companyConstants } from '../../_constants';
import { CompanyState, IAction } from '../../_interfaces';
import { MongoId } from '../../_interfaces/';
import { Company } from '../../../lib/interfaces';

describe('Companies Reducer', () => {
    const testErrorMessage = 'test';
    const item1 = mongoose.Types.ObjectId().toHexString();
    const item2 = mongoose.Types.ObjectId().toHexString();
    const testCompany: Company = {
        name: 'test',
        titles: [item1, item2]
    };
    const testCompany2: Company = {
        ...testCompany,
        name: 'test2'
    };
    const testItem: Company & MongoId = {
        ...testCompany,
        _id: mongoose.Types.ObjectId().toHexString()
    };
    const testItem2: Company & MongoId = {
        ...testCompany2,
        _id: mongoose.Types.ObjectId().toHexString()
    };
    const requestState: CompanyState = {
        ...initialState,
        loading: true
    };

    describe('When no action present', () => {
        it('Returns default state if no initial state is present', () => {
            expect(companies(undefined, {} as IAction)).toEqual(initialState);
        });

        it('Returns state', () => {
            expect(companies(requestState, {} as IAction)).toEqual(
                requestState
            );
        });
    });

    describe('Request Actions', () => {
        it('Handles requests by entering a loading state', () => {
            const requestActions = [
                {
                    type: companyConstants.CREATE_REQUEST
                },
                { type: companyConstants.GET_REQUEST },
                { type: companyConstants.GET_BY_ID_REQUEST },
                { type: companyConstants.UPDATE_REQUEST },
                { type: companyConstants.DELETE_REQUEST }
            ];
            requestActions.forEach(action => {
                expect(companies(initialState, action)).toEqual(requestState);
            });
        });
    });

    describe('Failure actions', () => {
        it('Handles failure by setting an error state', () => {
            const failureActions = [
                {
                    type: companyConstants.CREATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: companyConstants.GET_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: companyConstants.GET_BY_ID_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: companyConstants.UPDATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: companyConstants.DELETE_FAILURE,
                    error: Error(testErrorMessage)
                }
            ];
            const expectedState: CompanyState = {
                ...initialState,
                error: Error(testErrorMessage)
            };
            failureActions.forEach(action => {
                expect(companies(initialState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Success Actions', () => {
        describe('Create', () => {
            const action: IAction = {
                type: companyConstants.CREATE_SUCCESS,
                payload: testItem
            };
            it('Adds the item correctly to state', () => {
                const expectedState: CompanyState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testCompany
                    },
                    allIds: [testItem._id],
                    byName: {
                        [testItem.name]: testItem._id
                    }
                };
                expect(companies(requestState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Get All', () => {
        const action: IAction = {
            type: companyConstants.GET_SUCCESS,
            payload: [testItem, testItem2]
        };
        it('Adds items correctly to state', () => {
            const expectedState: CompanyState = {
                ...requestState,
                loading: false,
                byId: {
                    [testItem._id]: testCompany,
                    [testItem2._id]: testCompany2
                },
                allIds: [testItem._id, testItem2._id],
                byName: {
                    [testItem.name]: testItem._id,
                    [testItem2.name]: testItem2._id
                }
            };
            expect(companies(requestState, action)).toEqual(expectedState);
        });
    });

    describe('Get By Id', () => {
        it('Correctly adds returned id to selectedCompany in state', () => {
            const action: IAction = {
                type: companyConstants.GET_BY_ID_SUCCESS,
                payload: testItem
            };
            const expectedState: CompanyState = {
                ...requestState,
                loading: false,
                selectedCompany: testItem._id
            };
            expect(companies(requestState, action)).toEqual(expectedState);
        });
    });

    describe('Update', () => {
        it('Correctly updates a company', async () => {
            const testUpdate: Company & MongoId = {
                _id: testItem._id,
                name: testItem.name,
                titles: [
                    ...testItem.titles,
                    mongoose.Types.ObjectId().toHexString()
                ]
            };
            const { _id, ...testUpdatedCompany } = testUpdate;
            const action: IAction = {
                type: companyConstants.UPDATE_SUCCESS,
                payload: testUpdate
            };
            const preUpdateState = {
                ...requestState,
                byId: {
                    [testItem._id]: testCompany
                },
                allIds: [testItem._id],
                byName: {
                    [testItem.name]: testItem._id,
                    [testItem2.name]: testItem2._id
                }
            };
            const expectedState: CompanyState = {
                ...preUpdateState,
                byId: {
                    [testUpdate._id]: testUpdatedCompany as Company
                },
                loading: false
            };
            expect(companies(preUpdateState, action)).toEqual(expectedState);
        });
    });

    describe('Delete', () => {
        it('Correctly removes a company from state', () => {
            const action = {
                type: companyConstants.DELETE_SUCCESS,
                payload: testItem._id
            };
            const preDeleteState = {
                ...requestState,
                byId: {
                    [testItem._id]: testCompany,
                    [testItem2._id]: testCompany
                },
                allIds: [testItem._id, testItem2._id],
                byName: {
                    [testItem.name]: testItem._id,
                    [testItem2.name]: testItem2._id
                }
            };
            const expectedState = {
                ...preDeleteState,
                byId: { [testItem2._id]: testCompany },
                allIds: [testItem2._id],
                byName: {
                    [testItem2.name]: testItem2._id
                },
                loading: false
            };
            expect(companies(preDeleteState, action)).toEqual(expectedState);
        });
    });
});

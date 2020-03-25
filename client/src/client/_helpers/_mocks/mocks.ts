import { IActionTypes } from '../../_interfaces';

export const mockActionTypes: IActionTypes = {
    CREATE_REQUEST: 'test1',
    CREATE_SUCCESS: 'test2',
    CREATE_FAILURE: 'test3',
    GET_REQUEST: 'test4',
    GET_SUCCESS: 'test5',
    GET_FAILURE: 'test6',
    GET_BY_ID_REQUEST: 'test7',
    GET_BY_ID_SUCCESS: 'test8',
    GET_BY_ID_FAILURE: 'test9',
    UPDATE_REQUEST: 'test10',
    UPDATE_SUCCESS: 'test11',
    UPDATE_FAILURE: 'test12',
    DELETE_REQUEST: 'test13',
    DELETE_SUCCESS: 'test14',
    DELETE_FAILURE: 'test15'
};

export interface mockInterface {
    property: string;
    property2: number;
}

export const mockService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

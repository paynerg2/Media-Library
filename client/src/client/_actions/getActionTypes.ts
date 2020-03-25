import { IActionTypes } from '../_interfaces';
import { MongoId } from '../_interfaces/mongoId.interface';

export const getActionTypes = <T extends any>(constants: IActionTypes) => {
    const successWithPayload = <T extends any>(payload: T, type: string) => {
        return {
            type,
            payload
        };
    };

    const success = (type: string) => {
        return {
            type
        };
    };

    const failure = (error: Error, type: string) => {
        return {
            type,
            error
        };
    };

    const request = (type: string) => {
        return {
            type
        };
    };

    return {
        create: {
            request: () => request(constants.CREATE_REQUEST),
            success: (payload: T & MongoId) =>
                successWithPayload(payload, constants.CREATE_SUCCESS),
            failure: (error: Error) => failure(error, constants.CREATE_FAILURE)
        },
        getAll: {
            request: () => request(constants.GET_REQUEST),
            success: (payload: (T & MongoId)[]) =>
                successWithPayload(payload, constants.GET_SUCCESS),
            failure: (error: Error) => failure(error, constants.GET_FAILURE)
        },
        getById: {
            request: () => request(constants.GET_BY_ID_REQUEST),
            success: (payload: T & MongoId) =>
                successWithPayload(payload, constants.GET_BY_ID_SUCCESS),
            failure: (error: Error) =>
                failure(error, constants.GET_BY_ID_FAILURE)
        },
        update: {
            request: () => request(constants.UPDATE_REQUEST),
            success: (payload: T & MongoId) =>
                successWithPayload(payload, constants.UPDATE_SUCCESS),
            failure: (error: Error) => failure(error, constants.UPDATE_FAILURE)
        },
        _delete: {
            request: () => request(constants.DELETE_REQUEST),
            success: (payload: string) =>
                successWithPayload(payload, constants.DELETE_SUCCESS),
            failure: (error: Error) => failure(error, constants.DELETE_FAILURE)
        }
    };
};

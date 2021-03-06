import { IActionTypes } from '../_interfaces';

export const seriesConstants: IActionTypes = {
    CREATE_REQUEST: 'SERIES_CREATE_REQUEST',
    CREATE_SUCCESS: 'SERIES_CREATE_SUCCESS',
    CREATE_FAILURE: 'SERIES_CREATE_FAILURE',

    GET_REQUEST: 'SERIES_GET_REQUEST',
    GET_SUCCESS: 'SERIES_GET_SUCCESS',
    GET_FAILURE: 'SERIES_GET_FAILURE',

    GET_BY_ID_REQUEST: 'SERIES_GET_BY_ID_REQUEST',
    GET_BY_ID_SUCCESS: 'SERIES_GET_BY_ID_SUCCESS',
    GET_BY_ID_FAILURE: 'SERIES_GET_BY_ID_FAILURE',

    DELETE_REQUEST: 'SERIES_DELETE_REQUEST',
    DELETE_SUCCESS: 'SERIES_DELETE_SUCCESS',
    DELETE_FAILURE: 'SERIES_DELETE_FAILURE',

    UPDATE_REQUEST: 'SERIES_UPDATE_REQUEST',
    UPDATE_SUCCESS: 'SERIES_UPDATE_SUCCESS',
    UPDATE_FAILURE: 'SERIES_UPDATE_FAILURE'
};

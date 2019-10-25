import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { IActionTypes } from '../_interfaces';
import { getActionTypes } from './getActionTypes';
import { Item } from '../_interfaces/item.interface';

export const getActions = <T extends any>(
    service: any,
    constants: IActionTypes
) => {
    const actions = getActionTypes(constants);
    const create = (item: T) => async (dispatch: Dispatch<AnyAction>) => {
        const { request, success, failure } = actions.create;
        try {
            dispatch(request());
            const newItem: T & Item = await service.create(item);
            dispatch(success(newItem));
        } catch (error) {
            dispatch(failure(error));
        }
    };
    const getAll = () => async (dispatch: Dispatch<AnyAction>) => {
        const { request, success, failure } = actions.getAll;
        try {
            dispatch(request());
            const itemList: (T & Item)[] = await service.getAll();
            dispatch(success(itemList));
        } catch (error) {
            dispatch(failure(error));
        }
    };
    const getById = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
        const { request, success, failure } = actions.getById;
        try {
            dispatch(request());
            const item: T & Item = await service.getById(id);
            dispatch(success(item));
        } catch (error) {
            dispatch(failure(error));
        }
    };
    const update = (id: string, update: T) => async (
        dispatch: Dispatch<AnyAction>
    ) => {
        const { request, success, failure } = actions.update;
        try {
            dispatch(request());
            const updatedItem: T & Item = await service.update(id, update);
            dispatch(success(updatedItem));
        } catch (error) {
            dispatch(failure(error));
        }
    };
    const _delete = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
        const { request, success, failure } = actions._delete;
        try {
            dispatch(request());
            await service.delete(id);
            dispatch(success(id));
        } catch (error) {
            dispatch(failure(error));
        }
    };
    return {
        create,
        getAll,
        getById,
        update,
        delete: _delete
    };
};

import axios from '../_helpers/axios';
import { AxiosRequestConfig } from 'axios';

const create = <T extends any>(route: string) => async (
    item: T
): Promise<T> => {
    const options: AxiosRequestConfig = {
        data: item
    };

    try {
        const response = await axios.post(`/${route}`, options);
        return response.data;
    } catch (error) {
        throw Error(error.message);
    }
};

const getAll = <T extends any>(route: string) => async (): Promise<T[]> => {
    try {
        const response = await axios.get(`/${route}`);
        return response.data;
    } catch (error) {
        throw Error(error.message);
    }
};

const getById = <T extends any>(route: string) => async (
    id: string
): Promise<T> => {
    try {
        const response = await axios.get(`/${route}/${id}`);
        return response.data;
    } catch (error) {
        throw Error(error.message);
    }
};

const update = <T extends any>(route: string) => async (
    id: string,
    seriesUpdate: T
) => {
    const options: AxiosRequestConfig = {
        data: seriesUpdate
    };
    try {
        const response = await axios.put(`/${route}/${id}`, options);
        return response.data;
    } catch (error) {
        throw Error(error.message);
    }
};

const _delete = (route: string) => async (id: string) => {
    try {
        await axios.delete(`/${route}/${id}`);
    } catch (error) {
        throw Error(error.message);
    }
};

export const getService = <T extends any>(route: string) => {
    return {
        create: create<T>(route),
        getAll: getAll<T>(route),
        getById: getById<T>(route),
        update: update<T>(route),
        delete: _delete(route)
    };
};

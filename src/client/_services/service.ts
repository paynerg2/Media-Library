import axios from '../_helpers/axios';
import { AxiosRequestConfig } from 'axios';

const create = <T extends any>(route: string) => async (item: T) => {
    const options: AxiosRequestConfig = {
        data: item
    };

    try {
        await axios.post(`/${route}`, options);
    } catch (error) {
        throw Error(error.message);
    }
};

const getAll = (route: string) => async () => {
    try {
        return await axios.get(`/${route}`);
    } catch (error) {
        throw Error(error.message);
    }
};

const getById = (route: string) => async (id: string) => {
    try {
        return await axios.get(`/${route}/${id}`);
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
        await axios.put(`/${route}/${id}`, options);
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
        getAll: getAll(route),
        getById: getById(route),
        update: update<T>(route),
        delete: _delete(route)
    };
};

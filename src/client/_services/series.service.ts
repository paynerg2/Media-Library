import axios from '../_helpers/axios';
import { AxiosRequestConfig } from 'axios';
import { Series } from '../_interfaces';

const create = async (series: Series) => {
    const options: AxiosRequestConfig = {
        data: series
    };

    try {
        await axios.post('/series', options);
    } catch (error) {
        throw Error(`Series registration unsuccessful: ${error.message}`);
    }
};

const getAll = async () => {
    let series;
    try {
        series = await axios.get('/series');
    } catch (error) {
        throw Error(`Series GetAll Unsuccessful: ${error.message}`);
    }
    return series;
};

const getById = async (id: string) => {
    try {
        const series = await axios.get(`/series/${id}`);
        return series;
    } catch (error) {
        throw Error(`Series GetById Unsuccessful: ${error.message}`);
    }
};

const update = async (id: string, seriesUpdate: Series) => {
    const options: AxiosRequestConfig = {
        data: seriesUpdate
    };
    try {
        await axios.put(`/series/${id}`, options);
    } catch (error) {
        throw Error(`Series Update Unsuccessful: ${error.message}`);
    }
};

const _delete = async (id: string) => {
    try {
        await axios.delete(`/series/${id}`);
    } catch (error) {
        throw Error(`Series Delete Unsuccessful: ${error.message}`);
    }
};

export const seriesService = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

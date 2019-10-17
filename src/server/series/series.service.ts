import Series from './series.model';
import { ISeriesParams, ISeries } from './series.interface';

import { logger } from '../_helpers/logger';
import { seriesNotFound } from '../../lib/messages/series.errorMessages';
import { IService } from '../_interfaces/service.interface';

const getAll = async (): Promise<ISeriesParams[]> => {
    return await Series.find();
};

const getById = async (id: string): Promise<ISeriesParams | null> => {
    try {
        return await Series.findById(id);
    } catch (error) {
        logger.error(`${error} : ${seriesNotFound}`);
        throw Error(seriesNotFound);
    }
};

const create = async (seriesParams: ISeriesParams) => {
    try {
        const series: ISeries = new Series(seriesParams);
        await series.save();
    } catch (error) {
        logger.error(`Error in create service method: ${error}`);
        throw Error(error);
    }
};

const update = async (id: string, seriesParams: ISeriesParams) => {
    let series;
    try {
        series = await Series.findById(id);
    } catch (error) {
        logger.error(`${error} : ${seriesNotFound}`);
        throw new Error(seriesNotFound);
    }

    if (series) {
        Object.assign(series, seriesParams);
        await series.save();
    }
};

const _delete = async (id: string) => {
    await Series.findByIdAndRemove(id);
};

export const seriesService: IService<ISeriesParams> = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

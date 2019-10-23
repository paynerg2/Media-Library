import Series from './series.model';
import { ISeriesParams, ISeries } from './series.interface';

import { logger } from '../_helpers/logger';
import {
    seriesNotFound,
    duplicateSeries
} from '../../lib/messages/series.errorMessages';
import { IService } from '../_interfaces/service.interface';

const getAll = async (): Promise<ISeries[]> => {
    return await Series.find();
};

const getById = async (id: string): Promise<ISeries | null> => {
    try {
        return await Series.findById(id);
    } catch (error) {
        logger.error(`${error} : ${seriesNotFound}`);
        throw Error(seriesNotFound);
    }
};

const create = async (seriesParams: ISeriesParams): Promise<ISeries> => {
    // Check explicityly for duplicates
    const seriesAlreadyExists = await Series.findOne({
        name: seriesParams.name
    });
    if (seriesAlreadyExists) {
        throw Error(duplicateSeries);
    }

    try {
        const series: ISeries = new Series(seriesParams);
        return await series.save();
    } catch (error) {
        logger.error(`Error in create service method: ${error}`);
        throw Error(error);
    }
};

const update = async (
    id: string,
    seriesParams: ISeriesParams
): Promise<ISeries> => {
    let series;
    try {
        series = await Series.findById(id);
    } catch (error) {
        logger.error(`${error} : ${seriesNotFound}`);
        throw new Error(seriesNotFound);
    }

    if (series) {
        Object.assign(series, seriesParams);
        return await series.save();
    } else {
        throw Error(seriesNotFound);
    }
};

const _delete = async (id: string) => {
    await Series.findByIdAndRemove(id);
};

export const seriesService: IService<ISeriesParams, ISeries> = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

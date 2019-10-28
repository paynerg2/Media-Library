import Series from './series.model';
import { ISeriesParams, ISeries } from './series.interface';
import {
    seriesNotFound,
    duplicateSeries
} from '../../lib/messages/series.errorMessages';
import { IService } from '../_interfaces/service.interface';
import { getSimpleService } from '../_helpers/getSimpleService';

const errorMessages = {
    create: duplicateSeries,
    getById: seriesNotFound,
    update: seriesNotFound
};

const service: IService<ISeriesParams, ISeries> = getSimpleService<
    ISeriesParams,
    ISeries
>(Series, errorMessages);

const create = async (seriesParams: ISeriesParams): Promise<ISeries> => {
    // Check explicityly for duplicates
    const seriesAlreadyExists = await Series.findOne({
        name: seriesParams.name
    });
    if (seriesAlreadyExists) {
        throw Error(duplicateSeries);
    }

    return await service.create(seriesParams);
};

export const seriesService: IService<ISeriesParams, ISeries> = {
    getAll: service.getAll,
    getById: service.getById,
    create,
    update: service.update,
    delete: service.delete
};

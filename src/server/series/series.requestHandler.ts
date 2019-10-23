import { getRequestHandler } from '../_helpers/getRequestHandler';
import { ISeriesParams, ISeries } from './series.interface';

export const seriesRequestHandler = getRequestHandler<ISeriesParams, ISeries>(
    'series'
);

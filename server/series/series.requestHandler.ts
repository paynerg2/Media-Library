import { getRequestHandler } from '../_helpers/getRequestHandler';
import { ISeries } from './series.interface';
import { Series } from '../../client/src/lib/interfaces';

export const seriesRequestHandler = getRequestHandler<Series, ISeries>(
    'series'
);

import { seriesConstants } from '../_constants';
import { seriesService } from '../_services';
import { getActions } from './getActions';
import { Series } from '../../lib/interfaces';

export const seriesActions = getActions<Series>(seriesService, seriesConstants);

import { seriesConstants } from '../_constants';
import { seriesService } from '../_services';
import { getActions } from './getActions';

export const seriesActions = getActions(seriesService, seriesConstants);

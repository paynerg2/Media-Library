import { Series } from '../_interfaces';
import { getService } from './service';

export const seriesService = getService<Series>('series');

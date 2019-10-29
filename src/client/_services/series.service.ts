import { Series } from '../../lib/interfaces';
import { getService } from './service';

export const seriesService = getService<Series>('series');

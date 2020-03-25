import { Disc } from '../../lib/interfaces';
import { getService } from './service';

export const discService = getService<Disc>('discs');

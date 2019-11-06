import { Creator } from '../../lib/interfaces';
import { getService } from './service';

export const creatorService = getService<Creator>('creators');

import { getRequestHandler } from '../_helpers/getRequestHandler';
import { IDisc } from './disc.interface';
import { Disc } from '../../lib/interfaces';

export const discRequestHandler = getRequestHandler<Disc, IDisc>('disc');

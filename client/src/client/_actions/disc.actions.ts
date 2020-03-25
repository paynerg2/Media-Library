import { discConstants } from '../_constants';
import { discService } from '../_services';
import { getActions } from './getActions';
import { Disc } from '../../lib/interfaces';

export const discActions = getActions<Disc>(discService, discConstants);

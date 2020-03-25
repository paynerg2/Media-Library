import { creatorConstants } from '../_constants';
import { creatorService } from '../_services';
import { getActions } from './getActions';
import { Creator } from '../../lib/interfaces';

export const creatorActions = getActions<Creator>(
    creatorService,
    creatorConstants
);

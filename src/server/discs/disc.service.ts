import Disc from './disc.model';
import { IDisc } from './disc.interface';
import { Disc as DiscParams } from '../../lib/interfaces';

import { IService } from '../_interfaces/service.interface';
import { getSimpleService } from '../_helpers/getSimpleService';
import { discNotFound } from '../../lib/messages/disc.errorMessages';

const errorMessages = {
    getById: discNotFound,
    update: discNotFound
};

export const discService: IService<DiscParams, IDisc> = getSimpleService<
    DiscParams,
    IDisc
>(Disc, errorMessages);

import Disc from './disc.model';
import { IDisc } from './disc.interface';
import { Disc as DiscParams } from '../../client/src/lib/interfaces';
import { IService } from '../_interfaces/service.interface';
import { getSimpleService } from '../_helpers/getSimpleService';
import { discNotFound } from '../../client/src/lib/messages/disc.errorMessages';

const errorMessages = {
    getById: discNotFound,
    update: discNotFound
};

export const discService: IService<DiscParams, IDisc> = getSimpleService<
    DiscParams,
    IDisc
>(Disc, errorMessages);

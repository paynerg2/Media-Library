import Creator from './creator.model';
import { ICreator } from './creator.interface';
import { Creator as CreatorParams } from '../../client/src/lib/interfaces';
import { creatorNotFound } from '../../client/src/lib/messages/creator.errorMessages';
import { IService } from '../_interfaces/service.interface';
import { getSimpleService } from '../_helpers/getSimpleService';

const errorMessages = {
    getById: creatorNotFound,
    update: creatorNotFound
};

const service: IService<CreatorParams, ICreator> = getSimpleService<
    CreatorParams,
    ICreator
>(Creator, errorMessages);

// No additional guard clauses required
export const creatorService: IService<CreatorParams, ICreator> = service;

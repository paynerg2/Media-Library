import { getRequestHandler } from '../_helpers/getRequestHandler';
import { ICreator } from './creator.interface';
import { Creator } from '../../lib/interfaces';

export const creatorRequestHandler = getRequestHandler<Creator, ICreator>(
    'creator'
);

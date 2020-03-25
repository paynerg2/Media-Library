import { Document } from 'mongoose';
import { Creator } from '../../client/src/lib/interfaces';

export interface ICreator extends Creator, Document {}

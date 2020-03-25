import { Document } from 'mongoose';
import { Creator } from '../../lib/interfaces';

export interface ICreator extends Creator, Document {}

import { Document } from 'mongoose';
import { Book } from '../../client/src/lib/interfaces';

export interface IBook extends Book, Document {}

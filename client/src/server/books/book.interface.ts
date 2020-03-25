import { Document } from 'mongoose';
import { Book } from '../../lib/interfaces';

export interface IBook extends Book, Document {}

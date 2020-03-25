import { Document } from 'mongoose';
import { Company } from '../../client/src/lib/interfaces';

export interface ICompany extends Company, Document {}

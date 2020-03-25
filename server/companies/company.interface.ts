import { Document } from 'mongoose';
import { Company } from '../../lib/interfaces';

export interface ICompany extends Company, Document {}

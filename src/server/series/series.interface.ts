import { Document } from 'mongoose';
import { Series } from '../../lib/interfaces';

export interface ISeries extends Series, Document {}

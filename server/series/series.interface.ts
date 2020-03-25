import { Document } from 'mongoose';
import { Series } from '../../client/src/lib/interfaces';

export interface ISeries extends Series, Document {}

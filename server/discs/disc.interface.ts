import { Document } from 'mongoose';
import { Disc } from '../../client/src/lib/interfaces';

export interface IDisc extends Disc, Document {}

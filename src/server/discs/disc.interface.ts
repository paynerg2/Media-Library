import { Document } from 'mongoose';
import { Disc } from '../../lib/interfaces';

export interface IDisc extends Disc, Document {}

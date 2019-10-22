import { Document } from 'mongoose';

export interface ISeries extends ISeriesParams, Document {}

export interface ISeriesParams {
    name: string;
    items: any[];
}

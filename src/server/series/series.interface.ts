import { Document } from 'mongoose';

export interface ISeries extends ISeriesParams, Document {}

export interface ISeriesParams {
    title: string;
    items: any[];
}

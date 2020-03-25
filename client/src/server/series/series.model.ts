import mongoose, { Schema } from 'mongoose';
import { ISeries } from './series.interface';

const SeriesSchema: Schema = new Schema({
    name: { type: String, unique: true, required: true },
    items: { type: Array, default: [] }
});

export default mongoose.model<ISeries>('Series', SeriesSchema);

import mongoose, { Schema } from 'mongoose';
import { ItemSchema } from '../item/item.schema';
import { discFormats } from '../../client/src/lib/formats';
import { IDisc } from './disc.interface';

const DiscSchema: Schema = new Schema({
    ...ItemSchema,
    format: { type: [String], enum: discFormats, required: true },
    languages: { type: [String], required: true },
    subtitles: { type: [String] },
    volume: { type: Number, default: 1 },
    director: { type: String },
    studio: { type: String },
    isCollection: { type: Boolean, required: true }
});

export default mongoose.model<IDisc>('Disc', DiscSchema);

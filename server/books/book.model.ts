import mongoose, { Schema } from 'mongoose';
import { ItemSchema } from '../item/item.schema';
import { bookTypes } from '../../client/src/lib/formats';
import { IBook } from './book.interface';

const BookSchema: Schema = new Schema({
    ...ItemSchema,
    authors: { type: [String], required: true },
    language: { type: String, required: true, default: 'English' },
    type: { type: String, enum: bookTypes, required: true },
    artists: { type: [String], default: [] },
    colorer: { type: [String], default: [] },
    letterer: { type: [String], default: [] },
    volume: { type: Number, default: 1 },
    isbn: { type: String }
});

export default mongoose.model<IBook>('Book', BookSchema);

import mongoose, { Schema } from 'mongoose';
import { ICreator } from './creator.interface';

const CreatorSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    middleInitials: { type: String },
    lastName: { type: String },
    works: { type: Array, default: [] }
});

export default mongoose.model<ICreator>('Creator', CreatorSchema);

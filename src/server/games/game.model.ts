import mongoose, { Schema } from 'mongoose';
import { ItemSchema } from '../item/item.schema';
import { IGame } from './game.interface';

const GameSchema: Schema = new Schema({
    ...ItemSchema,
    platforms: { type: [String], required: true },
    languages: { type: [String], required: true },
    multiplayer: { type: Boolean, default: false },
    genre: { type: String }
});

export default mongoose.model<IGame>('Game', GameSchema);

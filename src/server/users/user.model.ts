import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';

const UserSchema: Schema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    hash: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);

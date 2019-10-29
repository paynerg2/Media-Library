import mongoose, { Schema } from 'mongoose';
import { ICompany } from './company.interface';

const CompanySchema: Schema = new Schema({
    name: { type: String, unique: true, required: true },
    titles: { type: [Schema.Types.ObjectId], default: [] },
    founded: { type: Date },
    founder: { type: Schema.Types.ObjectId },
    headquarters: { type: String },
    owners: { type: [Schema.Types.ObjectId], default: [] },
    predecessor: { type: Schema.Types.ObjectId },
    parent: { type: Schema.Types.ObjectId },
    website: { type: String, unique: true },
    status: { type: String, enum: ['Active', 'Inactive'] }
});

export default mongoose.model<ICompany>('Company', CompanySchema);

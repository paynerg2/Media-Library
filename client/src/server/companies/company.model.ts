import mongoose, { Schema } from 'mongoose';
import { ICompany } from './company.interface';

const CompanySchema: Schema = new Schema({
    name: { type: String, unique: true, required: true },
    titles: { type: [String], default: [] },
    founded: { type: Date },
    founder: { type: String },
    headquarters: { type: String },
    owners: { type: [String], default: [] },
    predecessor: { type: String },
    parent: { type: String },
    website: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'] }
});

export default mongoose.model<ICompany>('Company', CompanySchema);

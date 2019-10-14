import mongoose from 'mongoose';
import { env } from '../_helpers/env';

let connectionString = '';
// Note: if script in package.json has space between
// set NODE_ENV=test and &&<next command> it will
// set NODE_ENV to 'test ' with an additional space.
if (process.env.NODE_ENV === 'test') {
    connectionString = env.testConnectionString || '';
} else {
    connectionString = process.env.MONGODB_URI || env.connectionString || '';
}

export const disconnect = async () => {
    try {
        await mongoose.disconnect();
    } catch (err) {
        console.log(`Error disconnecting from database: ${err}`);
        return process.exit(1);
    }
};

import mongoose from 'mongoose';
import { env } from '../_helpers/env';
import { logger } from '../_helpers/logger';
import { connectOptions } from './connectOptions';

let connectionString = '';
// Note: if script in package.json has space between
// set NODE_ENV=test and &&<next command> it will
// set NODE_ENV to 'test ' with an additional space.
if (process.env.NODE_ENV === 'test') {
    connectionString = env.testConnectionString || '';
} else {
    connectionString = process.env.MONGODB_URI || env.connectionString || '';
}

// This may not be necessary with Mongoose 5
// This prevents memory leak issues associated with mPromise
// See: https://github.com/Automattic/mongoose/issues/1992
mongoose.Promise = global.Promise;

export const connect = async (options?: Array<string>) => {
    await mongoose
        .connect(connectionString, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
        .then(async () => {
            if (process.env.NODE_ENV !== 'test') {
                logger.info('Successfully connected to database');
            }
            if (
                options &&
                options.includes(connectOptions.dropUsers) &&
                process.env.NODE_ENV === 'test'
            ) {
                await mongoose.connection.db.dropCollection('users');
                logger.info('Dropping collection: users');
            }
            if (
                options &&
                options.includes(connectOptions.dropSeries) &&
                process.env.NODE_ENV === 'test'
            ) {
                await mongoose.connection.db.dropCollection('series');
                logger.info('Dropping collection: series');
            }
            if (
                options &&
                options.includes(connectOptions.dropCompanies) &&
                process.env.NODE_ENV === 'test'
            ) {
                await mongoose.connection.db.dropCollection('companies');
                logger.info('Dropping collection: companies');
            }
        })
        .catch(err => {
            logger.error(`Error connecting to database: ${err}`);
            return process.exit(1);
        });
};

mongoose.connection.on('disconnected', connect);

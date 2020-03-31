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
            const collections = await mongoose.connection.db
                .listCollections()
                .toArray();
            const collectionNames = collections.map(
                collection => collection.name
            );
            if (process.env.NODE_ENV !== 'test') {
                logger.info('Successfully connected to database');
            }
            if (
                options &&
                options.includes(connectOptions.dropUsers) &&
                process.env.NODE_ENV === 'test' &&
                collectionNames.includes('users')
            ) {
                await mongoose.connection.db.dropCollection('users');
                logger.info('Dropping collection: users');
            }
            if (
                options &&
                options.includes(connectOptions.dropSeries) &&
                process.env.NODE_ENV === 'test' &&
                collectionNames.includes('series')
            ) {
                await mongoose.connection.db.dropCollection('series');
                logger.info('Dropping collection: series');
            }
            if (
                options &&
                options.includes(connectOptions.dropCompanies) &&
                process.env.NODE_ENV === 'test' &&
                collectionNames.includes('companies')
            ) {
                await mongoose.connection.db.dropCollection('companies');
                logger.info('Dropping collection: companies');
            }
            if (
                options &&
                options.includes(connectOptions.dropCreators) &&
                process.env.NODE_ENV === 'test' &&
                collectionNames.includes('creators')
            ) {
                await mongoose.connection.db.dropCollection('creators');
                logger.info('Dropping collection: creators');
            }
            if (
                options &&
                options.includes(connectOptions.dropBooks) &&
                process.env.NODE_ENV === 'test' &&
                collectionNames.includes('books')
            ) {
                await mongoose.connection.db.dropCollection('books');
                logger.info('Dropping collection: books');
            }
            if (
                options &&
                options.includes(connectOptions.dropDiscs) &&
                process.env.NODE_ENV === 'test' &&
                collectionNames.includes('discs')
            ) {
                await mongoose.connection.db.dropCollection('discs');
                logger.info('Dropping collection: discs');
            }
            if (
                options &&
                options.includes(connectOptions.dropGames) &&
                process.env.NODE_ENV === 'test' &&
                collectionNames.includes('games')
            ) {
                await mongoose.connection.db.dropCollection('games');
                logger.info('Dropping collection: games');
            }
        })
        .catch(err => {
            logger.error(`Error connecting to database: ${err}`);
            console.log(
                `Failure to connect using connection string: ${connectionString}`
            );
            console.log(`connection options: ${connectOptions}`);
            console.log(`error message: ${err.message}`);
            return process.exit(1);
        });
};

mongoose.connection.on('disconnected', connect);

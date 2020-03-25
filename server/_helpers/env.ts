import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../../.env') });

// Importing env variables from this module ensures that config
// runs before they are expected.
export const env = {
    connectionString: process.env.CONNECTION_STRING || process.env.MONGODB_URI,
    secret: process.env.SECRET || process.env.PROD_SECRET,
    testConnectionString: process.env.TEST_DB_CONNECTION_STRING
};

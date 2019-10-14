import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../../.env') });

// Importing env variables from this module ensures that config
// runs before they are expected.
export const env = {
    connectionString: process.env.CONNECTION_STRING,
    secret: process.env.SECRET,
    testConnectionString: process.env.TEST_DB_CONNECTION_STRING
};

import { seriesSchema } from '../../lib/schemas';
const invalidSchemaType = 'Invalid schema type';

export const getSchema = (type: string) => {
    if (type === 'series') {
        return seriesSchema;
    } else {
        throw Error(invalidSchemaType);
    }
};

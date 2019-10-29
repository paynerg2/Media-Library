import { seriesSchema, companySchema } from '../../lib/schemas';

export const invalidSchemaType = 'Invalid schema type';

export const getSchema = (type: string) => {
    if (type === 'series') {
        return seriesSchema;
    } else if (type === 'company') {
        return companySchema;
    } else {
        throw Error(invalidSchemaType);
    }
};

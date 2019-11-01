import { seriesSchema, companySchema } from '../../lib/schemas';
import { creatorSchema } from '../../lib/schemas/creator.schema';

export const invalidSchemaType = 'Invalid schema type';

export const getSchema = (type: string) => {
    if (type === 'series') {
        return seriesSchema;
    } else if (type === 'company') {
        return companySchema;
    } else if (type === 'creator') {
        return creatorSchema;
    } else {
        throw Error(invalidSchemaType);
    }
};

import {
    seriesSchema,
    companySchema,
    bookSchema,
    discSchema
} from '../../lib/schemas';
import { creatorSchema } from '../../lib/schemas/creator.schema';

export const invalidSchemaType = 'Invalid schema type';

export const getSchema = (type: string) => {
    if (type === 'series') {
        return seriesSchema;
    } else if (type === 'company') {
        return companySchema;
    } else if (type === 'creator') {
        return creatorSchema;
    } else if (type === 'book') {
        return bookSchema;
    } else if (type === 'disc') {
        return discSchema;
    } else {
        throw Error(invalidSchemaType);
    }
};

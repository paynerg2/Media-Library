import { seriesSchema } from '../../../client/src/lib/schemas';
import { invalidSchemaType, getSchema } from '../getSchema';

describe('getSchema Helper', () => {
    it('Returns seriesSchema', () => {
        const schema = getSchema('series');
        expect(schema).toBe(seriesSchema);
    });

    it('Throws an error when passed an unexpected parameter', () => {
        const testParameter = 'test';
        try {
            const schema = getSchema(testParameter);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual(invalidSchemaType);
        }
    });
});

import { seriesSchema } from '../';
import { seriesNameIsRequired } from '../../messages/series.errorMessages';

describe('Series Schema', () => {
    const validateSeries = async (series: any) => {
        let error;
        try {
            await seriesSchema.validate(series);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when all required fields are present', async () => {
        const testSeries = {
            name: 'test'
        };
        const error = await validateSeries(testSeries);
        expect(error).toBeUndefined();
    });

    it('Returns an error when name is not present', async () => {
        const testSeries = {
            items: ['test', 'test']
        };
        const error = await validateSeries(testSeries);
        expect(error.path).toEqual('name');
        expect(error.message).toEqual(seriesNameIsRequired);
    });
});

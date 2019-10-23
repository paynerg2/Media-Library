import { seriesService } from '../../series/series.service';
import { getService, invalidServiceType } from '../getService';

describe('getService Helper Method (Backend)', () => {
    it('Returns series service', () => {
        const service = getService('series');
        expect(service).toBe(seriesService);
    });

    it('Throws an error when given an unexpected parameter', () => {
        const testParameter = 'test';
        try {
            const service = getService(testParameter);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual(invalidServiceType);
        }
    });
});

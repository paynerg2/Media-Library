/**
 * Functions as a test of the getSimpleService helper method.
 * Testing here instead of mocking a Mongoose.Model/Schema, because
 * the test implementation is the same with the exception of
 * additional guard statements in the create method.
 */

import Series from '../series.model';
import { seriesService } from '../series.service';
import { mockDocumentQuery } from '../../_helpers/testHelpers';
import { logger } from '../../_helpers/logger';
import { seriesNotFound } from '../../../client/src/lib/messages/series.errorMessages';

describe('Series Service', () => {
    beforeAll(() => {
        logger.error = jest.fn();
    });

    describe('Get All', () => {
        it('Calls find() on the model', async () => {
            Series.find = jest.fn(() => {
                return mockDocumentQuery;
            });
            await seriesService.getAll();
            expect(Series.find).toHaveBeenCalled();
        });
    });

    describe('Get By ID', () => {
        it('Calls findOne() on the model', async () => {
            const testId = 'test';
            Series.findOne = jest.fn(() => {
                return mockDocumentQuery;
            });
            await seriesService.getById(testId);
            expect(Series.findOne).toHaveBeenCalledWith(
                { _id: testId },
                undefined,
                undefined,
                undefined
            );
        });

        it('Logs and throws errors', async () => {
            const testId = 'test';
            const testErrorMessage = 'test';
            Series.findOne = jest.fn(() => {
                throw Error(testErrorMessage);
            });

            let error;
            try {
                await seriesService.getById(testId);
            } catch (e) {
                error = e;
            }
            expect(logger.error).toHaveBeenCalledWith(
                `${testErrorMessage} : ${seriesNotFound}`
            );
            expect(error).toBeDefined();
            expect(error.message).toEqual(seriesNotFound);
        });
    });

    describe('Update', () => {
        const testSeries = {
            name: 'test',
            items: ['test', 'test']
        };
        const testId = 'test';

        it('Calls findByOne() on the model', async () => {
            Series.findById = jest.fn(() => {
                return mockDocumentQuery;
            });
            await seriesService.update(testId, testSeries);
            expect(Series.findById).toHaveBeenCalledWith(testId);
        });

        it('Logs and rethrows errors', async () => {
            const testErrorMessage = 'test';
            Series.findById = jest.fn(() => {
                throw new Error(testErrorMessage);
            });

            let error;
            try {
                await seriesService.update(testId, testSeries);
            } catch (e) {
                error = e;
            }
            expect(logger.error).toHaveBeenCalledWith(
                `${testErrorMessage} : ${seriesNotFound}`
            );
            expect(error).toBeDefined();
            expect(error.message).toEqual(seriesNotFound);
        });
    });

    describe('Delete', () => {
        it('Calls findByIdAndRemove with expected parameters', async () => {
            const testId = 'test';
            Series.findByIdAndRemove = jest.fn(() => {
                return mockDocumentQuery;
            });
            await seriesService.delete(testId);
            expect(Series.findByIdAndRemove).toHaveBeenCalledWith(testId);
        });
    });
});

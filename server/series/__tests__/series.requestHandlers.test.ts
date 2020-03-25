/*
 * This test is mainly for the getRequestHandler helper function.
 * Rather than test it with mocked schema/service, it is tested here
 * with a simple model/entity. Any other request handler will work the
 * same way, so any other testing of request handlers for the simple models
 * is redundant.
 */

import { NextFunction } from 'connect';

import { seriesRequestHandler } from '../series.requestHandler';
import { seriesService } from '../series.service';
import { seriesSchema } from '../../../client/src/lib/schemas';
import { ISeries } from '../series.interface';
import { logger } from '../../_helpers/logger';
const {
    delete: _delete,
    create,
    getAll,
    getById,
    update
} = seriesRequestHandler;

describe('Series Controller', () => {
    let next: NextFunction;
    const testId: string = 'test';
    const testSeries = {
        name: 'test',
        items: ['test', 'test']
    };
    const testErrorMessage = 'test';
    beforeAll(() => {
        next = jest.fn();
        logger.error = jest.fn();
    });

    describe('Create Handler', () => {
        const req: any = {
            body: {
                data: testSeries
            }
        };
        const res: any = {
            json: jest.fn()
        };
        seriesSchema.validate = jest.fn();

        it('Calls validate & create from service with expected parameters', async () => {
            seriesService.create = jest.fn(() => {
                return Promise.resolve(testSeries as any);
            });
            await create(req, res, next);
            expect(seriesSchema.validate).toHaveBeenCalledWith(testSeries);
            expect(seriesService.create).toHaveBeenCalledWith(testSeries);
        });

        it('Calls next and logs error when an error is thrown by create() method', async () => {
            seriesService.create = jest.fn(() => {
                throw Error(testErrorMessage);
            });

            await create(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(testErrorMessage);
        });

        it('Calls next and logs error when an error is thrown by schema validation', async () => {
            seriesSchema.validate = jest.fn(() => {
                throw Error(testErrorMessage);
            });

            await create(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(testErrorMessage);
        });
    });

    describe('Get All Handler', () => {
        const req: any = {};
        const res: any = {};

        it('Calls getAll from the service', async () => {
            const mockData: ISeries[] = [];
            seriesService.getAll = jest.fn(() => {
                return Promise.resolve(mockData);
            });
            await getAll(req, res, next);
            expect(seriesService.getAll).toHaveBeenCalled();
        });

        it('Calls next and logs when an error is thrown', async () => {
            seriesService.getAll = jest.fn(() => {
                return Promise.reject(testErrorMessage);
            });
            await getAll(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(testErrorMessage);
        });
    });

    describe('Get By ID Handler', () => {
        const req: any = {
            params: {
                id: testId
            }
        };
        const res: any = {};

        it('Calls getById from service with expected parameters', async () => {
            seriesService.getById = jest.fn(() => {
                return Promise.resolve(null);
            });
            await getById(req, res, next);
            expect(seriesService.getById).toHaveBeenCalledWith(testId);
        });

        it('Calls next and logs when error is thrown', async () => {
            seriesService.getById = jest.fn(() => {
                return Promise.reject(testErrorMessage);
            });
            await getById(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(testErrorMessage);
        });
    });

    describe('Update Handler', () => {
        const req: any = {
            params: {
                id: testId
            },
            body: {
                data: testSeries
            }
        };
        const res: any = {};

        it('Calls update from the service with expected parameters', async () => {
            seriesSchema.validate = jest.fn();
            seriesService.update = jest.fn(() => {
                return Promise.resolve(testSeries as any);
            });
            await update(req, res, next);
            expect(seriesService.update).toHaveBeenCalledWith(
                testId,
                testSeries
            );
        });

        it('Calls next and logs when an error is thrown by update()', async () => {
            seriesService.update = jest.fn(() => {
                return Promise.reject(testErrorMessage);
            });
            seriesSchema.validate = jest.fn();
            await update(req, res, next);
            expect(seriesSchema.validate).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(testErrorMessage);
            expect(next).toHaveBeenCalled();
        });

        it('Calls next and logs when an error is thrown by validate()', async () => {
            seriesSchema.validate = jest.fn(() => {
                throw Error(testErrorMessage);
            });
            await update(req, res, next);
            expect(seriesSchema.validate).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(testErrorMessage);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('Delete Handler', () => {
        const req: any = {
            params: {
                id: testId
            }
        };
        const res: any = {};

        it('Calls delete from the service with expected parameters', async () => {
            seriesService.delete = jest.fn();
            await _delete(req, res, next);
            expect(seriesService.delete).toHaveBeenCalledWith(testId);
        });

        it('Calls next and logs when an error is thrown', async () => {
            seriesService.delete = jest.fn(() => {
                return Promise.reject(testErrorMessage);
            });
            await _delete(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(testErrorMessage);
        });
    });
});

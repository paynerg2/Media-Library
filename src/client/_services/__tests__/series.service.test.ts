import { AxiosResponse } from 'axios';
import axios from '../../_helpers/axios';
import { seriesService } from '../series.service';
import { tsExportAssignment } from '@babel/types';

describe('Series Service', () => {
    describe('Create', () => {
        const response: AxiosResponse = {
            data: [],
            status: 200,
            statusText: '',
            headers: {},
            config: {}
        };
        const testSeries = {
            name: 'test',
            items: ['test', 'test']
        };
        const testOptions = {
            data: testSeries
        };

        describe('On successful request', () => {
            it('Makes a post request with expected parameters', async () => {
                axios.post = jest.fn(() => Promise.resolve(response as any));

                try {
                    await seriesService.create(testSeries);
                    expect(axios.post).toHaveBeenCalledWith(
                        '/series',
                        testOptions
                    );
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                const testErrorMessage = 'test';
                axios.post = jest.fn(() =>
                    Promise.reject(Error(testErrorMessage))
                );

                try {
                    await seriesService.create(testSeries);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(
                        `Series registration unsuccessful: ${testErrorMessage}`
                    );
                }
            });
        });
    });

    describe('Get All', () => {
        const testSeries = {
            name: 'test',
            items: ['test', 'test']
        };
        const response: AxiosResponse = {
            data: [testSeries],
            status: 200,
            statusText: '',
            headers: {},
            config: {}
        };

        describe('On successful request', () => {
            it('Makes a get request', async () => {
                axios.get = jest.fn(() => Promise.resolve(response as any));
                try {
                    const response = await seriesService.getAll();
                    expect(axios.get).toHaveBeenCalledWith('/series');
                    expect(response.status).toEqual(200);
                    expect(response.data).toEqual([testSeries]);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                const testErrorMessage = 'test';
                axios.get = jest.fn(() =>
                    Promise.reject({ message: testErrorMessage })
                );

                try {
                    await seriesService.getAll();
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(
                        `Series GetAll Unsuccessful: ${testErrorMessage}`
                    );
                }
            });
        });
    });

    describe('Get By ID', () => {
        const testSeries = {
            name: 'test',
            items: ['test', 'test']
        };
        const response: AxiosResponse = {
            data: testSeries,
            status: 200,
            statusText: '',
            headers: {},
            config: {}
        };

        describe('On successful request', () => {
            it('Makes a get request with expected parameters', async () => {
                axios.get = jest.fn(() => Promise.resolve(response as any));
                const testId = 'test';

                try {
                    const response = await seriesService.getById(testId);
                    expect(axios.get).toHaveBeenCalledWith(`/series/${testId}`);
                    expect(response.data).toEqual(testSeries);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                const testErrorMessage = 'test';
                axios.get = jest.fn(() =>
                    Promise.reject({ message: testErrorMessage })
                );
                const testId = 'test';
                try {
                    await seriesService.getById(testId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(
                        `Series GetById Unsuccessful: ${testErrorMessage}`
                    );
                }
            });
        });
    });

    describe('Update', () => {
        const update = {
            name: 'test',
            items: ['test', 'update']
        };
        const response: AxiosResponse = {
            data: [],
            status: 200,
            statusText: '',
            headers: {},
            config: {}
        };
        const testOptions = {
            data: update
        };

        describe('On successful request', () => {
            it('Makes a put request with the expected parameters', async () => {
                axios.put = jest.fn(() => Promise.resolve(response as any));
                const testId = 'test';
                try {
                    await seriesService.update(testId, update);
                    expect(axios.put).toHaveBeenCalledWith(
                        `/series/${testId}`,
                        testOptions
                    );
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                const testErrorMessage = 'test';
                const testId = 'test';
                axios.put = jest.fn(() =>
                    Promise.reject({ message: testErrorMessage })
                );

                try {
                    await seriesService.update(testId, update);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(
                        `Series Update Unsuccessful: ${testErrorMessage}`
                    );
                }
            });
        });
    });

    describe('Delete', () => {
        const response: AxiosResponse = {
            data: [],
            status: 200,
            statusText: '',
            headers: {},
            config: {}
        };

        describe('On successful request', () => {
            it('Makes a delete request with expected parameters', async () => {
                axios.delete = jest.fn(() => Promise.resolve(response as any));
                const testId = 'test';
                try {
                    await seriesService.delete(testId);
                    expect(axios.delete).toHaveBeenCalledWith(
                        `/series/${testId}`
                    );
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                const testErrorMessage = 'test';
                const testId = 'test';
                axios.delete = jest.fn(() =>
                    Promise.reject({ message: testErrorMessage })
                );

                try {
                    await seriesService.delete(testId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(
                        `Series Delete Unsuccessful: ${testErrorMessage}`
                    );
                }
            });
        });
    });
});

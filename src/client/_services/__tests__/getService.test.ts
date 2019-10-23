import { AxiosResponse } from 'axios';
import axios from '../../_helpers/axios';
import { getService } from '../service';

describe('Service Factory Method', () => {
    const route = 'test';
    const service = getService<any>(route);

    const testItem = {
        name: 'test',
        items: ['test', 'test'],
        id: 'test'
    };
    const testErrorMessage = 'test';
    const testId = 'test';

    describe('Create', () => {
        describe('On successful request', () => {
            const response: AxiosResponse = {
                data: [],
                status: 200,
                statusText: '',
                headers: {},
                config: {}
            };
            const testOptions = {
                data: testItem
            };

            it('Makes a post request with expected parameters', async () => {
                axios.post = jest.fn(() => Promise.resolve(response as any));

                try {
                    await service.create(testItem);
                    expect(axios.post).toHaveBeenCalledWith(
                        `/${route}`,
                        testOptions
                    );
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                axios.post = jest.fn(() =>
                    Promise.reject(Error(testErrorMessage))
                );

                try {
                    await service.create(testItem);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(testErrorMessage);
                }
            });
        });
    });

    describe('Get All', () => {
        const response: AxiosResponse = {
            data: [testItem],
            status: 200,
            statusText: '',
            headers: {},
            config: {}
        };

        describe('On successful request', () => {
            it('Makes a get request', async () => {
                axios.get = jest.fn(() => Promise.resolve(response as any));
                try {
                    const response = await service.getAll();
                    expect(axios.get).toHaveBeenCalledWith(`/${route}`);
                    expect(response.status).toEqual(200);
                    expect(response.data).toEqual([testItem]);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                axios.get = jest.fn(() =>
                    Promise.reject({ message: testErrorMessage })
                );

                try {
                    await service.getAll();
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(testErrorMessage);
                }
            });
        });
    });

    describe('Get By ID', () => {
        const response: AxiosResponse = {
            data: testItem,
            status: 200,
            statusText: '',
            headers: {},
            config: {}
        };

        describe('On successful request', () => {
            it('Makes a get request with expected parameters', async () => {
                axios.get = jest.fn(() => Promise.resolve(response as any));

                try {
                    const response = await service.getById(testId);
                    expect(axios.get).toHaveBeenCalledWith(
                        `/${route}/${testId}`
                    );
                    expect(response.data).toEqual(testItem);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                axios.get = jest.fn(() =>
                    Promise.reject({ message: testErrorMessage })
                );

                try {
                    await service.getById(testId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(testErrorMessage);
                }
            });
        });
    });

    describe('Update', () => {
        const update = {
            name: 'test',
            items: ['test', 'update'],
            id: 'test'
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

                try {
                    await service.update(testId, update);
                    expect(axios.put).toHaveBeenCalledWith(
                        `/${route}/${testId}`,
                        testOptions
                    );
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                axios.put = jest.fn(() =>
                    Promise.reject({ message: testErrorMessage })
                );

                try {
                    await service.update(testId, update);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(testErrorMessage);
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

                try {
                    await service.delete(testId);
                    expect(axios.delete).toHaveBeenCalledWith(
                        `/${route}/${testId}`
                    );
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('On unsuccessful request', () => {
            it('Throws an error with expected message', async () => {
                axios.delete = jest.fn(() =>
                    Promise.reject({ message: testErrorMessage })
                );

                try {
                    await service.delete(testId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(testErrorMessage);
                }
            });
        });
    });
});

import { AxiosResponse } from 'axios';
import axios from '../../_helpers/axios';
import { getService } from '../service';

describe('Service Factory Method', () => {
    const route = 'test';
    interface mockInterface {
        name: string;
        items: string[];
        id: string;
    }
    const service = getService<mockInterface>(route);

    const testItem: mockInterface = {
        name: 'test',
        items: ['test', 'test'],
        id: 'test'
    };
    const testErrorMessage = 'test';
    const testId = 'test';

    describe('Create', () => {
        describe('On successful request', () => {
            const response: AxiosResponse = {
                data: testItem,
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
                    const item: mockInterface = await service.create(testItem);
                    expect(axios.post).toHaveBeenCalledWith(
                        `/${route}`,
                        testOptions
                    );
                    expect(item).toEqual(testItem);
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
                    const items: mockInterface[] = await service.getAll();
                    expect(axios.get).toHaveBeenCalledWith(`/${route}`);
                    expect(items).toEqual([testItem]);
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
                    const item = await service.getById(testId);
                    expect(axios.get).toHaveBeenCalledWith(
                        `/${route}/${testId}`
                    );
                    expect(item).toEqual(testItem);
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
            data: update,
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
                    const updatedItem = await service.update(testId, update);
                    expect(axios.put).toHaveBeenCalledWith(
                        `/${route}/${testId}`,
                        testOptions
                    );
                    expect(updatedItem).toEqual(update);
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

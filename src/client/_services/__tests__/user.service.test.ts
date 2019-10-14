import axios from '../../_helpers/axios';
import { userService } from '../user.service';
import { AxiosResponse } from 'axios';

describe('User Service', () => {
    describe('Create', () => {
        const response: AxiosResponse = {
            data: [],
            status: 200,
            statusText: '',
            headers: {},
            config: {}
        };
        const testUser = {
            username: 'test',
            password: 'test',
            email: 'test@test.com',
            createdDate: new Date()
        };
        const testOptions = {
            data: testUser
        };

        describe('On successful request', () => {
            it('Makes a post request with expected parameters', async () => {
                axios.post = jest.fn(() => Promise.resolve(response as any));

                try {
                    await userService.create(testUser);
                    expect(axios.post).toHaveBeenCalledWith(
                        '/users/register',
                        testOptions
                    );
                } catch (err) {
                    expect(err).toBeUndefined();
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
                    await userService.create(testUser);
                } catch (err) {
                    expect(err).toBeDefined();
                    expect(err.message).toEqual(
                        `User Registration Unsuccessful: ${testErrorMessage}`
                    );
                }
            });
        });
    });
});

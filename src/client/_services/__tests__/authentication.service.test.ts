import axios from '../../_helpers/axios';
import { authenticationService } from '../authentication.service';

describe('Authentication Service', () => {
    describe('Login', () => {
        const testUser = {
            username: 'test',
            password: 'test',
            email: 'test@test.com',
            createdDate: new Date()
        };
        const authedTestUser = {
            username: testUser.username,
            email: testUser.email,
            createdDate: testUser.createdDate,
            token: 'test'
        };
        const response: any = { data: authedTestUser };
        const testOptions = {
            data: {
                username: testUser.username,
                password: testUser.password
            }
        };

        describe('On successful request', () => {
            it('Makes a post request with expected parameters', async () => {
                axios.post = jest.fn(() => Promise.resolve(response));

                try {
                    const user = await authenticationService.login(
                        testUser.username,
                        testUser.password
                    );

                    expect(axios.post).toHaveBeenCalledWith(
                        '/users/authenticate',
                        testOptions
                    );
                    expect(localStorage.setItem).toHaveBeenCalledWith(
                        'user',
                        JSON.stringify(user)
                    );
                    expect(localStorage.__STORE__['user']).toEqual(
                        JSON.stringify(user)
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
                    await authenticationService.login(
                        testUser.username,
                        testUser.password
                    );
                } catch (err) {
                    expect(err).toBeDefined();
                    expect(err.message).toEqual(testErrorMessage);
                }
            });
        });
    });

    describe('Logout', () => {
        it('Removes the user from localstorage', () => {
            // Add a user to localstorage to mock being logged in
            const testUser = {
                username: 'test',
                password: 'test',
                email: 'test@test.com',
                createdDate: new Date()
            };
            const authedTestUser = {
                username: testUser.username,
                email: testUser.email,
                createdDate: testUser.createdDate,
                token: 'test'
            };
            localStorage.setItem('user', JSON.stringify(authedTestUser));
            expect(localStorage.__STORE__['user']).toEqual(
                JSON.stringify(authedTestUser)
            );

            authenticationService.logout();
            expect(localStorage.removeItem).toHaveBeenCalledWith('user');
            expect(localStorage.__STORE__['user']).toBeUndefined();
        });
    });
});

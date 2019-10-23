import request from 'supertest';
import { connect } from '../_helpers/connect';
import { disconnect } from '../_helpers/disconnect';
import { invalidToken } from '../../lib/messages/error-handler.errorMessages';
import {
    invalidUsernameOrPassword,
    duplicateUsername,
    duplicateEmail,
    usernameNotLongEnough,
    passwordNotLongEnough,
    invalidEmail,
    usernameIsRequired,
    passwordIsRequired,
    emailIsRequired,
    userNotFound
} from '../../lib/messages/user.errorMessages';
import {
    seriesNameIsRequired,
    duplicateSeries,
    seriesNotFound
} from '../../lib/messages/series.errorMessages';
import { app } from '../app';
import { userService } from '../users/user.service';
import { seriesService } from '../series/series.service';
import { getCleanedResponse } from '../_helpers/testHelpers';
import { connectOptions } from '../_helpers/connectOptions';

const testUser = {
    username: 'test',
    password: 'test',
    email: 'test@test.com'
};

describe('Integration Tests', () => {
    it('is in test mode', () => {
        expect(process.env.NODE_ENV).toEqual('test');
    });

    describe('User route requests [(Request) -> App -> Controller -> Service -> Model -> DB]', () => {
        beforeAll(async () => {
            await connect([connectOptions.dropUsers]);
        });

        afterAll(async () => {
            await disconnect();
        });

        describe('Public Routes', () => {
            describe('(Register) /users | POST', () => {
                it('Adds a user to the database', async () => {
                    // Add a test user to the database

                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({ data: testUser });
                    expect(postResponse.status).toEqual(200);
                    expect(postResponse.body).toEqual({});
                });

                // Validation Errors:
                it('Rejects with an error when username is already taken', async () => {
                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({
                            data: { ...testUser, email: 'test2@test.com' }
                        });
                    expect(postResponse.status).toEqual(500);
                    expect(postResponse.error).toBeDefined();
                    expect(postResponse.body).toEqual({
                        message: duplicateUsername
                    });
                });

                it('Rejects with an error when email is already taken', async () => {
                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({ data: { ...testUser, username: 'test2' } });
                    expect(postResponse.status).toEqual(500);
                    expect(postResponse.error).toBeDefined();
                    expect(postResponse.body).toEqual({
                        message: duplicateEmail
                    });
                });

                it('Rejects with an error when username is too short', async () => {
                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({
                            data: {
                                ...testUser,
                                username: 't',
                                email: 'test2@test.com'
                            }
                        });
                    expect(postResponse.status).toEqual(400);
                    expect(postResponse.error).toBeDefined();
                    expect(postResponse.body).toEqual({
                        message: usernameNotLongEnough
                    });
                });

                it('Rejects with an error when password is too short', async () => {
                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({
                            data: {
                                username: 'test2',
                                password: 't',
                                email: 'test2@test.com'
                            }
                        });
                    expect(postResponse.status).toEqual(400);
                    expect(postResponse.error).toBeDefined();
                    expect(postResponse.body).toEqual({
                        message: passwordNotLongEnough
                    });
                });

                it('Rejects with an error when email is not of a valid format', async () => {
                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({
                            data: {
                                username: 'test2',
                                email: 'ttttttt',
                                password: 'test'
                            }
                        });
                    expect(postResponse.status).toEqual(400);
                    expect(postResponse.error).toBeDefined();
                    expect(postResponse.body).toEqual({
                        message: invalidEmail
                    });
                });

                it('Rejects with an error when username is not provided', async () => {
                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({
                            data: { email: 'test2@test.com', password: 'test' }
                        });
                    expect(postResponse.status).toEqual(400);
                    expect(postResponse.error).toBeDefined();
                    expect(postResponse.body).toEqual({
                        message: usernameIsRequired
                    });
                });

                it('Rejects with an error when password is not provided', async () => {
                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({
                            data: { email: 'test2@test.com', username: 'test2' }
                        });
                    expect(postResponse.status).toEqual(400);
                    expect(postResponse.error).toBeDefined();
                    expect(postResponse.body).toEqual({
                        message: passwordIsRequired
                    });
                });

                it('Rejects with an error when email is not provided', async () => {
                    const postResponse = await request(app)
                        .post('/users/register')
                        .send({
                            data: { username: 'test2', password: 'test' }
                        });
                    expect(postResponse.status).toEqual(400);
                    expect(postResponse.error).toBeDefined();
                    expect(postResponse.body).toEqual({
                        message: emailIsRequired
                    });
                });
            });
        });

        describe('Unauthorized Private Route Access', () => {
            it('/users | GET : Rejects with 401 Unauthorized Error', async () => {
                const response = await request(app).get('/users');
                expect(response.status).toEqual(401);
                expect(response.error).toBeDefined();
                expect(response.body).toEqual({ message: invalidToken });
            });

            it('/users/:id | GET : Rejects with 401 Unauthorized Error', async () => {
                const response = await request(app).post('/users/2');
                expect(response.status).toEqual(401);
                expect(response.error).toBeDefined();
                expect(response.body).toEqual({ message: invalidToken });
            });

            it('/users/:id | PUT : Rejects with 401 Unauthorized Error', async () => {
                const response = await request(app)
                    .put('/users/2')
                    .send({ data: testUser });
                expect(response.status).toEqual(401);
                expect(response.error).toBeDefined();
                expect(response.body).toEqual({ message: invalidToken });
            });

            it('/users/:id | DELETE : Rejects with 401 Unauthorized Error', async () => {
                const response = await request(app).delete('/users/2');
                expect(response.status).toEqual(401);
                expect(response.error).toBeDefined();
                expect(response.body).toEqual({ message: invalidToken });
            });
        });

        describe('Private Routes', () => {
            let token: string | null;

            describe('(Login) /users/authenticate | POST', () => {
                it('Rejects with 400 Validation Error if given invalid credentials', async () => {
                    const authenticationResponse = await request(app)
                        .post('/users/authenticate')
                        .send({ data: { username: 'fake', password: 'fake' } });
                    expect(authenticationResponse.status).toEqual(400);
                    expect(authenticationResponse.body.token).toBeUndefined();
                    expect(authenticationResponse.error).toBeDefined();
                    expect(authenticationResponse.body).toEqual({
                        message: invalidUsernameOrPassword
                    });
                });

                it('Validates user and returns jwt token', async () => {
                    const authenticationResponse = await request(app)
                        .post('/users/authenticate')
                        .send({
                            data: {
                                username: testUser.username,
                                password: testUser.password
                            }
                        });
                    expect(authenticationResponse.status).toEqual(200);
                    expect(authenticationResponse.body.token).toBeDefined();
                    token = authenticationResponse.body.token;
                });
            });

            describe('(GetAll) /users | GET', () => {
                it('Returns a full list of users', async () => {
                    const getResponse = await request(app)
                        .get('/users')
                        .set('Authorization', 'Bearer ' + token);
                    expect(getResponse.status).toEqual(200);
                    expect(getResponse.body[0].username).toEqual(
                        testUser.username
                    );
                    expect(getResponse.body[0].email).toEqual(testUser.email);
                });
            });

            describe('(Get By Id) /users/:id | GET', () => {
                it('Successfully retrieves a user by id', async () => {
                    // Currently assumes that this test is run after the POST test has left a user in the DB
                    // Get the id from the first user returned
                    const getResponse = await request(app)
                        .get('/users')
                        .set('Authorization', 'Bearer ' + token);
                    expect(getResponse.status).toEqual(200);
                    expect(getResponse.body.length).toEqual(1);
                    expect(getResponse.body[0]._id).toBeDefined();
                    const expectedUser = getResponse.body[0];
                    const id = getResponse.body[0]._id;

                    // Check that the user returned when requesting by id is the same
                    const getByIdResponse = await request(app)
                        .get(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token);
                    expect(getByIdResponse.status).toEqual(200);
                    expect(getByIdResponse.body).toEqual(expectedUser);
                });

                it('Returns an error if user not found', async () => {
                    const getResponse = await request(app)
                        .get('/users/2')
                        .set('Authorization', 'Bearer ' + token);
                    expect(getResponse.status).toEqual(500);
                    expect(getResponse.error).toBeDefined();
                });
            });

            describe('(Update) /users/:id | PUT', () => {
                let id: String;
                let expectedUser: any;
                const secondUser = {
                    username: 'second',
                    password: 'test',
                    email: 'secondUser@test.com'
                };
                beforeAll(async () => {
                    // Currently assumes that this test is run after the POST test has left a user in the DB
                    // Get the first user returned
                    const getResponse = await request(app)
                        .get('/users')
                        .set('Authorization', 'Bearer ' + token);
                    expectedUser = getResponse.body[0];
                    id = getResponse.body[0]._id;

                    // Add a second user to the database
                    await request(app)
                        .post('/users/register')
                        .send({ data: secondUser })
                        .set('Authorization', 'Bearer ' + token);
                });

                it('Successfully updates selected user', async () => {
                    // Update the user
                    const expectedUpdate = {
                        username: expectedUser.username,
                        password: testUser.password,
                        email: 'update@test.com'
                    };
                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(200);
                    expect(putResponse.body).toEqual({});

                    // Check that the user is correctly updated
                    const getResponse2 = await request(app)
                        .get(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token);
                    const updatedUser = getResponse2.body;
                    expect(getResponse2.status).toEqual(200);
                    expect(updatedUser.username).toEqual(
                        expectedUpdate.username
                    );
                    expect(updatedUser.email).toEqual(expectedUpdate.email);
                });

                it('Rejects when the requested username is already taken', async () => {
                    const expectedUpdate = {
                        username: secondUser.username,
                        password: testUser.password,
                        email: expectedUser.email
                    };

                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(500);
                    expect(putResponse.error).toBeDefined();
                    expect(putResponse.body).toEqual({
                        message: duplicateUsername
                    });
                });

                it('Rejects when the requested email is already taken', async () => {
                    const expectedUpdate = {
                        username: expectedUser.username,
                        password: testUser.password,
                        email: secondUser.email
                    };

                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(500);
                    expect(putResponse.error).toBeDefined();
                    expect(putResponse.body).toEqual({
                        message: duplicateEmail
                    });
                });

                it('Rejects if the new username is too short', async () => {
                    const expectedUpdate = {
                        username: 't',
                        password: testUser.password,
                        email: expectedUser.email
                    };

                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.error).toBeDefined();
                    expect(putResponse.body).toEqual({
                        message: usernameNotLongEnough
                    });
                });

                it('Rejects if the new password is too short', async () => {
                    const expectedUpdate = {
                        username: expectedUser.username,
                        password: 't',
                        email: expectedUser.email
                    };

                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.error).toBeDefined();
                    expect(putResponse.body).toEqual({
                        message: passwordNotLongEnough
                    });
                });

                it('Rejects if the new email is not valid format', async () => {
                    const expectedUpdate = {
                        username: expectedUser.username,
                        password: testUser.password,
                        email: 'ttttt'
                    };

                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.error).toBeDefined();
                    expect(putResponse.body).toEqual({
                        message: invalidEmail
                    });
                });

                it('Rejects when username is not included', async () => {
                    const expectedUpdate = {
                        password: testUser.password,
                        email: testUser.email
                    };

                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.error).toBeDefined();
                    expect(putResponse.body).toEqual({
                        message: usernameIsRequired
                    });
                });

                it('Rejects when password is not included', async () => {
                    const expectedUpdate = {
                        username: expectedUser.username,
                        email: testUser.email
                    };

                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.error).toBeDefined();
                    expect(putResponse.body).toEqual({
                        message: passwordIsRequired
                    });
                });

                it('Rejects when email is not included', async () => {
                    const expectedUpdate = {
                        username: expectedUser.username,
                        password: testUser.password
                    };

                    const putResponse = await request(app)
                        .put(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token)
                        .send({ data: expectedUpdate });
                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.error).toBeDefined();
                    expect(putResponse.body).toEqual({
                        message: emailIsRequired
                    });
                });
            });

            describe('(Delete) /users/:id | DELETE', () => {
                it('Successfully deletes user with selected id', async () => {
                    // Currently assumes that this test is run after the POST test has left a user in the DB
                    // Get the first user returned
                    const getResponse = await request(app)
                        .get('/users')
                        .set('Authorization', 'Bearer ' + token);
                    expect(getResponse.status).toEqual(200);
                    expect(getResponse.body.length).toEqual(2);
                    expect(getResponse.body[0]._id).toBeDefined();
                    const id = getResponse.body[0]._id;

                    // Delete the user by id
                    const deleteResponse = await request(app)
                        .delete(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token);
                    expect(deleteResponse.status).toEqual(200);
                    expect(deleteResponse.body).toEqual({});

                    // Expect the user to no longer by found in DB
                    const getByIdResponse = await request(app)
                        .get(`/users/${id}`)
                        .set('Authorization', 'Bearer ' + token);
                    expect(getByIdResponse.status).toEqual(401);
                    expect(getByIdResponse.error).toBeDefined();
                });

                it('Returns an error if the user does not exist', async () => {
                    const deleteResponse = await request(app)
                        .delete('/users/2')
                        .set('Authorization', 'Bearer ' + token);
                    expect(deleteResponse.status).toEqual(401);
                    expect(deleteResponse.error).toBeDefined();
                });
            });
        });
    });

    describe('User Service calls [Service -> Model -> DB]', () => {
        beforeAll(async () => {
            await connect([connectOptions.dropUsers]);
        });

        afterAll(async () => {
            await disconnect();
        });

        const testUser = {
            username: 'test',
            password: 'test',
            email: 'test@test.com',
            createdDate: new Date()
        };

        describe('Get Method | Empty DB', () => {
            it('Returns an empty array', async () => {
                try {
                    const users = await userService.getAll();
                    expect(users).toEqual([]);
                } catch (err) {
                    expect(err).toBeUndefined();
                }
            });
        });

        describe('Create Method', () => {
            it('Adds a user to the database', async () => {
                try {
                    await userService.create(testUser);
                    const users = await userService.getAll();
                    expect(users[0].username).toEqual(testUser.username);
                    expect(users[0].email).toEqual(testUser.email);
                    expect(users[0].createdDate).toEqual(testUser.createdDate);
                } catch (err) {
                    expect(err).toBeUndefined();
                }
            });

            it('Returns an error if the username is taken', async () => {
                const testUser2 = {
                    username: testUser.username,
                    email: 'test2@test.com',
                    password: 'test',
                    createdDate: new Date()
                };

                try {
                    await userService.create(testUser2);
                } catch (err) {
                    expect(err).toBeDefined();
                    expect(err.message).toEqual(duplicateUsername);
                }
            });
        });

        describe('Get By ID Method', () => {
            it('Retrieves a specific user from the database', async () => {
                try {
                    const users = await userService.getAll();
                    const expectedUser = users[0];
                    const user = await userService.getById(expectedUser._id);
                    expect(user!.username).toEqual(expectedUser.username);
                    expect(user!.email).toEqual(expectedUser.email);
                    expect(user!._id).toEqual(expectedUser._id);
                    expect(user!.createdDate).toEqual(expectedUser.createdDate);
                } catch (err) {
                    expect(err).toBeUndefined();
                }
            });

            it('Returns error if user not found', async () => {
                try {
                    await userService.getById('2');
                } catch (err) {
                    expect(err).toBeDefined();
                    expect(err.message).toEqual(userNotFound);
                }
            });
        });

        describe('Update Method', () => {
            it('Updates a specific user', async () => {
                try {
                    const users = await userService.getAll();
                    const user = users[0];
                    const updatedUser = {
                        _id: user._id,
                        username: user.username,
                        password: testUser.password,
                        createdDate: user.createdDate!,
                        email: 'update@test.com'
                    };
                    await userService.update(user._id, updatedUser);
                    const actualUpdate = await userService.getById(user._id);
                    expect(actualUpdate!.username).toEqual(
                        updatedUser.username
                    );
                    expect(actualUpdate!.email).toEqual(updatedUser.email);
                    expect(actualUpdate!.createdDate).toEqual(
                        updatedUser.createdDate
                    );
                    expect(actualUpdate!._id).toEqual(updatedUser._id);
                } catch (err) {
                    expect(err).toBeUndefined();
                }
            });

            it('Returns an error if user not found', async () => {
                try {
                    await userService.update('2', testUser);
                } catch (err) {
                    expect(err).toBeDefined();
                    expect(err.message).toEqual(userNotFound);
                }
            });

            it('Returns error if the username is taken', async () => {
                const testUser2 = {
                    username: 'test2',
                    password: 'test',
                    email: 'test2@test.com',
                    createdDate: new Date()
                };
                try {
                    await userService.create(testUser2);
                } catch (err) {
                    expect(err).toBeUndefined();
                }

                try {
                    const users = await userService.getAll();
                    const user = users[0];
                    // Build update by replacing with another user's username and leaving the rest the same
                    const userToUpdate = {
                        username: testUser2.username,
                        password: testUser.password,
                        email: user.email,
                        createdDate: user.createdDate || new Date(),
                        _id: user._id
                    };

                    await userService.update(userToUpdate._id, userToUpdate);
                } catch (err) {
                    expect(err).toBeDefined();
                    expect(err.message).toEqual(duplicateUsername);
                }
            });
        });

        describe('Delete method', () => {
            it('Deletes a specified user from the database', async () => {
                let id;
                try {
                    const users = await userService.getAll();
                    const user = users[0];
                    id = user._id;
                    await userService.delete(id);
                    const actualUser = await userService.getById(id);
                    expect(actualUser).toBeNull();
                } catch (err) {
                    expect(err).toBeUndefined();
                }
            });
        });
    });

    describe('Series route requests [(Request) -> App -> Controller -> Service -> Model -> DB]', () => {
        let token: string | null;
        beforeAll(async () => {
            await connect([connectOptions.dropSeries]);
            token = await login();
        });

        afterAll(async () => {
            await disconnect();
        });

        const testSeries = {
            name: 'test',
            items: ['test', 'test']
        };

        describe('(Create) /series | POST', () => {
            it('Adds a series to the database', async () => {
                const postResponse = await request(app)
                    .post('/series')
                    .send({ data: testSeries })
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(postResponse.body);
                expect(postResponse.status).toEqual(200);
                expect(cleanedResponse).toEqual(testSeries);
            });

            it('Rejects with an error when the series already exists', async () => {
                const postResponse = await request(app)
                    .post('/series')
                    .send({ data: testSeries })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(500);
                expect(postResponse.body).toEqual({ message: duplicateSeries });
            });

            // Validation Errors
            it('Rejects with an error when title is not provided', async () => {
                const postResponse = await request(app)
                    .post('/series')
                    .send({
                        data: { items: ['test', 'test'] }
                    })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: seriesNameIsRequired
                });
            });
        });

        describe('(Get All) /series | GET', () => {
            it('Returns a full list of series', async () => {
                const getResponse = await request(app)
                    .get('/series')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body[0].name).toEqual(testSeries.name);
                expect(getResponse.body[0].items).toEqual(testSeries.items);
            });
        });

        describe('(Get By Id) /series/:id | GET', () => {
            it('Successfully retrieves a series by id', async () => {
                // Retrieve the first user returned from the database
                const getResponse = await request(app)
                    .get('/series')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const expectedSeries = getResponse.body[0];
                const id = getResponse.body[0]._id;

                // Search for that user by id & compare
                const getByIdResponse = await request(app)
                    .get(`/series/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(200);
                expect(getByIdResponse.body).toEqual(expectedSeries);
            });

            it('Returns an error if series not found', async () => {
                const getResponse = await request(app)
                    .get('/series/2')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(500);
                expect(getResponse.error).toBeDefined();
            });
        });

        describe('(Update) /series/:id | PUT', () => {
            let id: string;
            let expectedSeries: any;
            const secondSeries = {
                name: 'second',
                items: ['second', 'test']
            };
            beforeAll(async () => {
                const getResponse = await request(app)
                    .get('/series')
                    .set('Authorization', 'Bearer ' + token);
                expectedSeries = getResponse.body[0];
                id = getResponse.body[0]._id;

                // Add a second series to the database
                await request(app)
                    .post('/series')
                    .send({ data: secondSeries })
                    .set('Authorization', 'Bearer ' + token);
            });

            it('Successfully updates selected series', async () => {
                // Update series
                const expectedUpdate = {
                    name: expectedSeries.name,
                    items: ['updated', 'items']
                };
                const putReponse = await request(app)
                    .put(`/series/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });
                const cleanedResponse = getCleanedResponse(putReponse.body);
                expect(putReponse.status).toEqual(200);
                expect(cleanedResponse).toEqual(expectedUpdate);
            });

            it('Rejects when name is not included', async () => {
                const expectedUpdate = {
                    item: ['test', 'test2']
                };

                const putResponse = await request(app)
                    .put(`/series/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });
                expect(putResponse.status).toEqual(400);
                expect(putResponse.error).toBeDefined();
                expect(putResponse.body).toEqual({
                    message: seriesNameIsRequired
                });
            });
        });

        describe('(Delete) /series/:id | DELETE', () => {
            it('Successfully deletes the series with selected id', async () => {
                const getResponse = await request(app)
                    .get('/series')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(2);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;

                // Delete the series by id
                const deleteResponse = await request(app)
                    .delete(`/series/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(deleteResponse.status).toEqual(200);
                expect(deleteResponse.body).toEqual({});

                // Expect the series to no longer by found in DB
                const getByIdResponse = await request(app)
                    .get(`/series/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(404);
                expect(getByIdResponse.error).toBeDefined();
            });
        });
    });

    describe('Series Service calls [Service ->Model -> DB]', () => {
        beforeAll(async () => {
            await connect([connectOptions.dropSeries]);
        });

        afterAll(async () => {
            await disconnect();
        });

        const testSeries = {
            name: 'test',
            items: ['test', 'test']
        };

        describe('Get Method | Empty DB', () => {
            it('Returns an empty array', async () => {
                try {
                    const series = await seriesService.getAll();
                    expect(series).toEqual([]);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Create Method', () => {
            it('Adds a series to the database', async () => {
                try {
                    await seriesService.create(testSeries);
                    const series = await seriesService.getAll();
                    const cleanedResponse = getCleanedResponse(series);
                    expect(cleanedResponse).toEqual(testSeries);
                } catch (error) {
                    expect(error).toBeDefined();
                }
            });

            it('Returns an error if the series name is taken', async () => {
                const testSeries2 = {
                    name: testSeries.name,
                    items: []
                };

                try {
                    await seriesService.create(testSeries2);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(duplicateSeries);
                }
            });
        });

        describe('Get By ID Method', () => {
            it('Retrieves a specific series from the database', async () => {
                try {
                    const seriesList = await seriesService.getAll();
                    const expectedSeries = seriesList[0];
                    const series = await seriesService.getById(
                        expectedSeries._id
                    );
                    expect(series!.name).toEqual(expectedSeries.name);
                    expect(series!._id).toEqual(expectedSeries._id);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns error if series not found', async () => {
                try {
                    await seriesService.getById('2');
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error).toEqual(Error(seriesNotFound));
                }
            });
        });

        describe('Update Method', () => {
            it('Updates a specific series', async () => {
                try {
                    const seriesList = await seriesService.getAll();
                    const series = seriesList[0];
                    const updatedSeries = {
                        _id: series._id,
                        name: series.name,
                        items: ['test', 'update']
                    };
                    await seriesService.update(series._id, updatedSeries);
                    const actualUpdate = await seriesService.getById(
                        updatedSeries._id
                    );
                    expect(actualUpdate!.name).toEqual(updatedSeries.name);
                    expect(actualUpdate!._id).toEqual(updatedSeries._id);
                    // Compare individual items. Service returns full Mongosoe query,
                    // where items is type: CoreMongooseArray. This could be
                    // fixed by adding .lean() to the end of mongoose queries
                    // to return a normal javascript object.
                    for (let i = 0; i < updatedSeries.items.length; i++) {
                        expect(actualUpdate!.items[i]).toEqual(
                            updatedSeries.items[i]
                        );
                    }
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if series not found', async () => {
                try {
                    await seriesService.update('2', testSeries);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(seriesNotFound);
                }
            });
        });

        describe('Delete Method', () => {
            it('Deletes a specified series from the database', async () => {
                try {
                    const seriesList = await seriesService.getAll();
                    const series = seriesList[0];
                    await seriesService.delete(series._id);
                    const actualSeries = await seriesService.getById(
                        series._id
                    );
                    expect(actualSeries).toBeNull();
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });
    });
});

const login = async () => {
    // Create a user
    const loginCredentials = {
        username: 'fakelogin',
        email: 'fake@email.com',
        password: 'fakepassword'
    };

    let token: string | null;
    await request(app)
        .post('/users/register')
        .send({ data: { ...loginCredentials } });

    const authenticationResponse = await request(app)
        .post('/users/authenticate')
        .send({
            data: {
                username: loginCredentials.username,
                password: loginCredentials.password
            }
        });
    token = authenticationResponse.body.token;
    return token;
};

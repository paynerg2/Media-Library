import request from 'supertest';
import mongoose from 'mongoose';
import { connect } from '../_helpers/connect';
import { disconnect } from '../_helpers/disconnect';

import { app } from '../app';
import { getCleanedResponse } from '../_helpers/testHelpers';
import { connectOptions } from '../_helpers/connectOptions';
import {
    Company,
    Creator,
    Book,
    Disc,
    Game
} from '../../client/src/lib/interfaces';

import { userService } from '../users/user.service';
import { seriesService } from '../series/series.service';
import { companyService } from '../companies/company.service';
import { bookService } from '../books/book.service';
import { discService } from '../discs/disc.service';
import { creatorService } from '../creators/creator.service';
import { gameService } from '../games/game.service';
import { bookTypes, discFormats } from '../../client/src/lib/formats';

import {
    seriesNameIsRequired,
    duplicateSeries,
    seriesNotFound
} from '../../client/src/lib/messages/series.errorMessages';
import {
    duplicateCompany,
    companyNotFound,
    companyNameIsRequired
} from '../../client/src/lib/messages/company.errorMessages';
import {
    firstNameIsRequired,
    creatorNotFound
} from '../../client/src/lib/messages/creator.errorMessages';

import { invalidToken } from '../../client/src/lib/messages/error-handler.errorMessages';
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
} from '../../client/src/lib/messages/user.errorMessages';
import {
    bookNotFound,
    authorIsRequired,
    languageIsRequired,
    invalidType,
    typeIsRequired
} from '../../client/src/lib/messages/book.errorMessages';
import {
    titleIsRequired,
    physicalRequired,
    digitalRequired,
    publisherRequired
} from '../../client/src/lib/messages/item.errorMessages';
import {
    discNotFound,
    formatIsRequired,
    invalidFormat,
    mustBePostive,
    discLanguageIsRequired
} from '../../client/src/lib/messages/disc.errorMessages';
import {
    gameNotFound,
    platformIsRequired,
    multiplayerMustBeIndicated
} from '../../client/src/lib/messages/game.errorMessages';

const testUser = {
    username: 'test',
    password: 'test',
    email: 'test@test.com'
};

jest.clearAllMocks();

describe('Integration Tests', () => {
    it('is in test mode', () => {
        expect(process.env.NODE_ENV).toEqual('test');
    });

    describe('User route requests [(Request) -> App -> Controller -> Service -> Model -> DB]', () => {
        // Note: Test may timeout without increased threshold
        // as well as done parameter. This is not the case
        // in the boilerplate version, and was not the case
        // until well into working on unrelated parts of the program.
        // Jest can be pretty buggy, it seems, or perhaps the test database
        // has become particularly slow to connect now that there are more
        // than 2 collections.
        beforeAll(async done => {
            await connect([connectOptions.dropUsers]);
            done();
        }, 10000);

        afterAll(async done => {
            await disconnect();
            done();
        });

        describe('Public Routes', () => {
            describe('(Register) /users | POST', () => {
                it('passes a super generic smoke test', () => {
                    const test = 'test';
                    expect(test).toEqual(test);
                });

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
                // Retrieve the first series returned from the database
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
                expect(getResponse.body.length).toEqual(1);
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

    describe('Series Service calls [Service -> Model -> DB]', () => {
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
                    const cleanedResponse = getCleanedResponse(series[0]);
                    expect(cleanedResponse).toEqual(testSeries);
                } catch (error) {
                    expect(error).toBeUndefined();
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

    describe('Company route requests [(Request) -> App -> Controller -> Service -> Model -> DB]', () => {
        let token: string | null;
        beforeAll(async () => {
            await connect([connectOptions.dropCompanies]);
            token = await login();
        });

        afterAll(async () => {
            await disconnect();
        });
        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();

        const testCompany: Company = {
            name: 'test',
            titles: [item1, item2]
        };

        describe('(Create) /companies | POST', () => {
            it('Adds a company to the database', async () => {
                const postResponse = await request(app)
                    .post('/companies')
                    .send({ data: testCompany })
                    .set('Authorization', 'Bearer ' + token);
                // Expect default values to be added by Mongo
                const expectedResponse: Company = {
                    ...testCompany,
                    owners: []
                };
                const cleanedResponse = getCleanedResponse(postResponse.body);
                expect(postResponse.status).toEqual(200);
                expect(cleanedResponse).toEqual(expectedResponse);
            });

            it('Rejects with an error when the company exists already', async () => {
                const postResponse = await request(app)
                    .post('/companies')
                    .send({ data: testCompany })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(500);
                expect(postResponse.body).toEqual({
                    message: duplicateCompany
                });
            });
        });

        describe('(Get All) /companies | GET', () => {
            it('Returns a full list of companies', async () => {
                const getResponse = await request(app)
                    .get('/companies')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body[0].name).toEqual(testCompany.name);
                expect(getResponse.body[0].titles).toEqual(testCompany.titles);
            });
        });

        describe('(Get By Id) /companies/:id | GET', () => {
            it('Successfully retrieves a company by id', async () => {
                // Get id from first company returned
                const getResponse = await request(app)
                    .get('/companies')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const expectedCompany = getResponse.body[0];
                const id = getResponse.body[0]._id;

                // Search for that company by id
                const getByIdResponse = await request(app)
                    .get(`/companies/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(200);
                expect(getByIdResponse.body).toEqual(expectedCompany);
            });

            it('Returns an error if series not found', async () => {
                const randomId: string = mongoose.Types.ObjectId().toHexString();
                const getResponse = await request(app)
                    .get(`/companies/${randomId}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(404);
                expect(getResponse.error).toBeDefined();
            });
        });

        describe('(Update) /series/:id | PUT', () => {
            let id: string;
            let expectedCompany: any;

            beforeAll(async () => {
                const getResponse = await request(app)
                    .get('/companies')
                    .set('Authorization', 'Bearer ' + token);
                expectedCompany = getResponse.body[0];
                id = getResponse.body[0]._id;
            });

            it('Successfully updates selected company', async () => {
                const newItem = mongoose.Types.ObjectId().toHexString();
                const expectedUpdate = {
                    name: expectedCompany.name,
                    owners: [],
                    titles: [...expectedCompany.titles, newItem]
                };
                const putResponse = await request(app)
                    .put(`/companies/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });
                const cleanedResponse = getCleanedResponse(putResponse.body);
                expect(putResponse.status).toEqual(200);
                expect(cleanedResponse).toEqual(expectedUpdate);
            });

            it('Rejects when  name is not included', async () => {
                const newItem = mongoose.Types.ObjectId().toHexString();
                const expectedUpdate = {
                    titles: [...testCompany.titles, newItem]
                };
                const putResponse = await request(app)
                    .put(`/companies/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });

                expect(putResponse.status).toEqual(400);
                expect(putResponse.error).toBeDefined();
                expect(putResponse.body).toEqual({
                    message: companyNameIsRequired
                });
            });
        });

        describe('(Delete) /companies/:id | DELETE', () => {
            it('Successfully deletes the series with selected id', async () => {
                // Get the id of the first company returned
                const getResponse = await request(app)
                    .get('/companies')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;

                // Use that id to delete the series
                const deleteResponse = await request(app)
                    .delete(`/companies/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(deleteResponse.status).toEqual(200);
                expect(deleteResponse.body).toEqual({});

                // Expect the company to no longer by found in DB
                const getByIdResponse = await request(app)
                    .get(`/companies/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(404);
                expect(getByIdResponse.error).toBeDefined();
            });
        });
    });

    describe('Company Service Calls [Service -> Model -> DB]', () => {
        beforeAll(async () => {
            await connect([connectOptions.dropCompanies]);
        });

        afterAll(async () => {
            await disconnect();
        });

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testCompany: Company = {
            name: 'test',
            titles: [item1, item2]
        };

        describe('Get Method | Empty DB', () => {
            it('Returns an empty array', async () => {
                try {
                    const companies = await companyService.getAll();
                    expect(companies).toEqual([]);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Create Method', () => {
            it('Adds a company to the database', async () => {
                const expectedResponse = {
                    ...testCompany,
                    owners: []
                };
                try {
                    const company: Company = await companyService.create(
                        testCompany
                    );
                    const cleanedResponse = getCleanedResponse(company);
                    expect(cleanedResponse).toEqual(expectedResponse);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if the company name is taken', async () => {
                const testCompany2 = {
                    name: testCompany.name,
                    titles: []
                };

                try {
                    await companyService.create(testCompany2);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(duplicateCompany);
                }
            });
        });

        describe('Get By ID Method', () => {
            it('Retrieves a specific series from the database', async () => {
                try {
                    const companyList = await companyService.getAll();
                    const expectedCompany = companyList[0];
                    const company = await companyService.getById(
                        expectedCompany._id
                    );
                    expect(company!._id).toEqual(expectedCompany._id);
                    const cleanedResponse = getCleanedResponse(company);
                    const cleanedExpectation = getCleanedResponse(
                        expectedCompany
                    );
                    expect(cleanedResponse).toEqual(cleanedExpectation);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns error if company is not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await companyService.getById(fakeId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error).toEqual(Error(companyNotFound));
                }
            });
        });

        describe('Update Method', () => {
            it('Updates a specific company', async () => {
                try {
                    const companyList = await companyService.getAll();
                    const company = getCleanedResponse(companyList[0]);
                    const updatedCompany = {
                        ...company,
                        titles: [...company.titles, 'update']
                    };
                    await companyService.update(
                        companyList[0]._id,
                        updatedCompany
                    );
                    const actualUpdate = await companyService.getById(
                        companyList[0]._id
                    );
                    expect(actualUpdate!._id).toEqual(companyList[0]._id);
                    const cleanedResponse = getCleanedResponse(actualUpdate);
                    expect(cleanedResponse).toEqual(updatedCompany);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if series not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await companyService.update(fakeId, testCompany);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(companyNotFound);
                }
            });
        });

        describe('Delete Method', () => {
            it('Deletes a specified company from the database', async () => {
                try {
                    const companyList = await companyService.getAll();
                    const id = companyList[0]._id;
                    await companyService.delete(id);
                    const actualSeries = await companyService.getById(id);
                    expect(actualSeries).toBeNull();
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });
    });

    describe('Creator route requests [(Request) -> App -> Controller -> Service -> Model -> DB]', () => {
        let token: string | null;
        beforeAll(async () => {
            await connect([connectOptions.dropCreators]);
            token = await login();
        });

        afterAll(async () => {
            await disconnect();
        });
        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testCreator: Creator = {
            firstName: 'test',
            middleInitials: 'T.',
            lastName: 'tester',
            works: [item1, item2]
        };

        describe('(Create) /creators | POST', () => {
            it('Adds a creator to the database', async () => {
                const postResponse = await request(app)
                    .post('/creators')
                    .send({ data: testCreator })
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(postResponse.body);
                expect(postResponse.status).toEqual(200);
                expect(cleanedResponse).toEqual(testCreator);
            });
        });

        describe('(Get All) /creators | GET', () => {
            it('Returns a full list of creators', async () => {
                const getResponse = await request(app)
                    .get('/creators')
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(getResponse.body);
                const expectedResponse = [testCreator];
                expect(cleanedResponse).toEqual(expectedResponse);
            });
        });

        describe('(Get By Id /creators/:id | GET', () => {
            it('Successfully retrieves a creator by id', async () => {
                // Get the id from the first creator returned
                const getResponse = await request(app)
                    .get('/creators')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;
                const expectedCreator = getResponse.body[0];

                // Search for that creator by id
                const getByIdResponse = await request(app)
                    .get(`/creators/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(200);
                expect(getByIdResponse.body).toEqual(expectedCreator);
            });

            it('Returns an error if creator not found', async () => {
                const randomId: string = mongoose.Types.ObjectId().toHexString();
                const getResponse = await request(app)
                    .get(`/creators/${randomId}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(404);
                expect(getResponse.error).toBeDefined();
            });
        });

        describe('(Update) /creators/:id | PUT', () => {
            let id: string;
            let expectedCreator: any;

            beforeAll(async () => {
                const getResponse = await request(app)
                    .get('/creators')
                    .set('Authorization', 'Bearer ' + token);
                expectedCreator = getCleanedResponse(getResponse.body[0]);
                id = getResponse.body[0]._id;
            });

            it('Successfully updates selected creator', async () => {
                const newItem = mongoose.Types.ObjectId().toHexString();
                const expectedUpdate = {
                    ...expectedCreator,
                    works: [...expectedCreator.works, newItem]
                };

                const putResponse = await request(app)
                    .put(`/creators/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });
                expect(putResponse.status).toEqual(200);
                const cleanedResponse = getCleanedResponse(putResponse.body);
                expect(cleanedResponse).toEqual(expectedUpdate);
            });

            it('Rejects when firstName is not included', async () => {
                const { firstName, ...expectedUpdate } = testCreator;
                const putResponse = await request(app)
                    .put(`/creators/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });
                expect(putResponse.status).toEqual(400);
                expect(putResponse.error).toBeDefined();
                expect(putResponse.body).toEqual({
                    message: firstNameIsRequired
                });
            });
        });

        describe('(Delete) /creators/:id | DELETE', () => {
            it('Successfully deletes the creator with selected id', async () => {
                // Get the id from the first creator returned
                const getResponse = await request(app)
                    .get('/creators')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;

                // Use that id to delete the creator
                const deleteResponse = await request(app)
                    .delete(`/creators/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(deleteResponse.status).toEqual(200);
                expect(deleteResponse.body).toEqual({});

                // Expect the creator to no longer be in DB
                const getByIdResponse = await request(app)
                    .get(`/creators/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(404);
                expect(getByIdResponse.error).toBeDefined();
            });
        });
    });

    describe('Creator Service Calls [Service -> Model -> DB]', () => {
        beforeAll(async () => {
            await connect([connectOptions.dropCreators]);
        });
        afterAll(async () => {
            await disconnect();
        });

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testCreator: Creator = {
            firstName: 'test',
            middleInitials: 'T.',
            lastName: 'tester',
            works: [item1, item2]
        };

        describe('Get Method | Empty DB', () => {
            it('Returns an empty array', async () => {
                try {
                    const creators = await creatorService.getAll();
                    expect(creators).toEqual([]);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Create Method', () => {
            it('Adds a creator to the database', async () => {
                try {
                    const creator: Creator = await creatorService.create(
                        testCreator
                    );
                    const cleanedResponse = getCleanedResponse(creator);
                    expect(cleanedResponse).toEqual(testCreator);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Get By ID Method', () => {
            it('Retrieves a specific creator from the database', async () => {
                try {
                    const creatorList = await creatorService.getAll();
                    const expectedCreator = creatorList[0];
                    const creator = await creatorService.getById(
                        expectedCreator._id
                    );
                    expect(creator!._id).toEqual(expectedCreator._id);
                    const cleanedResponse = getCleanedResponse(creator);
                    const cleanedExpectation = getCleanedResponse(
                        expectedCreator
                    );
                    expect(cleanedResponse).toEqual(cleanedExpectation);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns error if creator is not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await creatorService.getById(fakeId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(Error(creatorNotFound));
                }
            });
        });

        describe('Update Method', () => {
            it('Updates a specific creator', async () => {
                try {
                    const creatorList = await creatorService.getAll();
                    const creator: Creator = getCleanedResponse(creatorList[0]);
                    const updatedCreator = {
                        ...creator,
                        works: [...creator.works!, 'update']
                    };
                    await creatorService.update(
                        creatorList[0]._id,
                        updatedCreator
                    );
                    const actualUpdate = await creatorService.getById(
                        creatorList[0]._id
                    );
                    expect(actualUpdate!._id).toEqual(creatorList[0]._id);
                    const cleanedResponse = getCleanedResponse(actualUpdate);
                    expect(cleanedResponse).toEqual(updatedCreator);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if creator not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await creatorService.update(fakeId, testCreator);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(creatorNotFound);
                }
            });
        });

        describe('Delete Method', () => {
            it('Deletes a specified creator from the database', async () => {
                try {
                    const creatorList = await creatorService.getAll();
                    const id = creatorList[0]._id;
                    await creatorService.delete(id);
                    const actualCreator = await creatorService.getById(id);
                    expect(actualCreator).toBeNull();
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });
    });

    describe('Book Service Calls [Service -> Model -> DB]', () => {
        beforeAll(async () => {
            await connect([connectOptions.dropBooks]);
        });
        afterAll(async () => {
            await disconnect();
        });

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testBook: Book = {
            title: 'test',
            authors: [item1, item2],
            artists: [item1],
            colorer: [item1],
            letterer: [item2],
            publisher: item1,
            language: 'test',
            physical: true,
            digital: false,
            checkedOut: true,
            checkedOutBy: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehostedhere.com',
            location: 'test',
            type: bookTypes[0],
            series: item1,
            volume: 3,
            isbn: 'test'
        };

        describe('Get Method | Empty DB', () => {
            it('Returns an empty array', async () => {
                try {
                    const books = await bookService.getAll();
                    expect(books).toEqual([]);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Create Method', () => {
            it('Adds a creator to the database', async () => {
                try {
                    const book: Book = await bookService.create(testBook);
                    const cleanedResponse = getCleanedResponse(book);
                    expect(cleanedResponse).toEqual(testBook);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Get By Id Method', () => {
            it('Retrieves a specific book from the database', async () => {
                try {
                    const bookList = await bookService.getAll();
                    const expectedBook = bookList[0];
                    const book = await bookService.getById(expectedBook._id);
                    expect(book!._id).toEqual(expectedBook._id);
                    const cleanedResponse = getCleanedResponse(book);
                    const cleanedExpectation = getCleanedResponse(expectedBook);
                    expect(cleanedResponse).toEqual(cleanedExpectation);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns error if book not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await bookService.getById(fakeId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(Error(bookNotFound));
                }
            });
        });

        describe('Update Method', () => {
            it('Updates a specific book', async () => {
                try {
                    const bookList = await bookService.getAll();
                    const book = getCleanedResponse(bookList[0]);
                    const updatedBook = {
                        ...book,
                        checkedOut: !book.checkedOut
                    };
                    await bookService.update(bookList[0]._id, updatedBook);
                    const actualUpdate = await bookService.getById(
                        bookList[0]._id
                    );
                    expect(actualUpdate!._id).toEqual(bookList[0]._id);
                    const cleanedResponse = getCleanedResponse(actualUpdate);
                    expect(cleanedResponse).toEqual(updatedBook);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if book not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await bookService.update(fakeId, testBook);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(bookNotFound);
                }
            });
        });

        describe('Delete Method', () => {
            it('Deletes a specified book from the database', async () => {
                try {
                    const bookList = await bookService.getAll();
                    const id = bookList[0]._id;
                    await bookService.delete(id);
                    const actualBook = await bookService.getById(id);
                    expect(actualBook).toBeNull();
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });
    });

    describe('Book route requests [(Request) -> App -> Controller -> Service -> Model -> DB]', () => {
        let token: string | null;
        beforeAll(async () => {
            await connect([connectOptions.dropBooks]);
            token = await login();
        });

        afterAll(async () => {
            await disconnect();
        });

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testBook: Book = {
            title: 'test',
            authors: [item1, item2],
            artists: [item1],
            colorer: [item1],
            letterer: [item2],
            publisher: item1,
            language: 'test',
            physical: true,
            digital: false,
            checkedOut: true,
            checkedOutBy: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehostedhere.com',
            location: 'test',
            type: bookTypes[0],
            series: item1,
            volume: 3,
            isbn: 'test'
        };

        describe('(Create) /books | POST', () => {
            it('Adds a book to the database', async () => {
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: testBook })
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(postResponse.body);
                expect(postResponse.status).toEqual(200);
                expect(cleanedResponse).toEqual(testBook);
            });

            /**
             * Validation Tests
             */

            it('Rejects when title not included', async () => {
                const { title, ...bookWithoutTitle } = testBook;
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: bookWithoutTitle })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: titleIsRequired
                });
            });
            it('Rejects when physical not included', async () => {
                const { physical, ...bookWithoutPhysical } = testBook;
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: bookWithoutPhysical })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: physicalRequired
                });
            });
            it('Rejects when digital not included', async () => {
                const { digital, ...bookWithoutDigital } = testBook;
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: bookWithoutDigital })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: digitalRequired
                });
            });
            it('Rejects when publisher not included', async () => {
                const { publisher, ...bookWithoutPublisher } = testBook;
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: bookWithoutPublisher })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: publisherRequired
                });
            });
            it('Rejects when authors not included', async () => {
                const { authors, ...bookWithoutAuthors } = testBook;
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: bookWithoutAuthors })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: authorIsRequired
                });
            });
            it('Rejects when language not included', async () => {
                const { language, ...bookWithoutLanguage } = testBook;
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: bookWithoutLanguage })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: languageIsRequired
                });
            });
            it('Rejects when type not included', async () => {
                const { type, ...bookWithoutType } = testBook;
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: bookWithoutType })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: typeIsRequired
                });
            });

            it('Rejects when type is invalid', async () => {
                const bookWithInvalidType = {
                    ...testBook,
                    type: 'test'
                };
                const postResponse = await request(app)
                    .post('/books')
                    .send({ data: bookWithInvalidType })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: invalidType
                });
            });
        });

        describe('(Get All) /books | GET', () => {
            it('Returns a full list of books', async () => {
                const getResponse = await request(app)
                    .get('/books')
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(getResponse.body);
                const expectedResponse = [testBook];
                expect(cleanedResponse).toEqual(expectedResponse);
            });
        });

        describe('(Get By Id) /books/:id | GET', () => {
            it('Successfully retrieves a book by id', async () => {
                const getResponse = await request(app)
                    .get('/books')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;
                const expectedBook = getResponse.body[0];

                const getByIdResponse = await request(app)
                    .get(`/books/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(200);
                expect(getByIdResponse.body).toEqual(expectedBook);
            });

            it('Returns an error if book not found', async () => {
                const randomId: string = mongoose.Types.ObjectId().toHexString();
                const getResponse = await request(app)
                    .get(`/books/${randomId}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(404);
                expect(getResponse.error).toBeDefined();
            });
        });

        describe('(Update) /books/:id | PUT', () => {
            let id: string;
            let expectedBook: any;

            beforeAll(async () => {
                const getResponse = await request(app)
                    .get('/books')
                    .set('Authorization', 'Bearer ' + token);
                expectedBook = getCleanedResponse(getResponse.body[0]);
                id = getResponse.body[0]._id;
            });

            it('Successfully updates the selected book', async () => {
                const expectedUpdate = {
                    ...expectedBook,
                    checkedOut: !expectedBook.checkedOut
                };

                const putResponse = await request(app)
                    .put(`/books/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });
                expect(putResponse.status).toEqual(200);
                const cleanedResponse = getCleanedResponse(putResponse.body);
                expect(cleanedResponse).toEqual(expectedUpdate);
            });
        });

        describe('(Delete) /books/:id | DELETE', () => {
            it('Successfully deletes the book with selected id', async () => {
                // Get id from first book returned
                const getResponse = await request(app)
                    .get('/books')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;

                // Use id to delete book
                const deleteResponse = await request(app)
                    .delete(`/books/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(deleteResponse.status).toEqual(200);
                expect(deleteResponse.body).toEqual({});

                // Expect book to no longer be in DB
                const getByIdResponse = await request(app)
                    .get(`/books/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(404);
                expect(getByIdResponse.error).toBeDefined();
            });
        });
    });

    describe('Disc Service Calls [Service -> Model -> DB]', () => {
        beforeAll(async () => {
            await connect([connectOptions.dropDiscs]);
        });
        afterAll(async () => {
            await disconnect();
        });

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testDisc: Disc = {
            title: 'test',
            checkedOut: true,
            checkedOutBy: item1,
            physical: true,
            digital: true,
            series: item2,
            publisher: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehost.com',
            location: 'test',
            format: [discFormats[0], discFormats[1]],
            languages: ['English', 'Test'],
            subtitles: ['English', 'Test'],
            volume: 3,
            studio: item2,
            isCollection: false
        };

        describe('Get Method | Empty DB', () => {
            it('Returns an empty array', async () => {
                try {
                    const books = await bookService.getAll();
                    expect(books).toEqual([]);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Create Method', () => {
            it('Adds a disc to the database', async () => {
                try {
                    const disc: Disc = await discService.create(testDisc);
                    const cleanedResponse = getCleanedResponse(disc);
                    expect(cleanedResponse).toEqual(testDisc);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Get By Id Method', () => {
            it('Retrives a specific disc from the database', async () => {
                try {
                    const discList = await discService.getAll();
                    const expectedDisc = discList[0];
                    const disc = await discService.getById(expectedDisc._id);
                    expect(disc!._id).toEqual(expectedDisc._id);
                    const cleanedResponse = getCleanedResponse(disc);
                    const cleanedExpectation = getCleanedResponse(expectedDisc);
                    expect(cleanedResponse).toEqual(cleanedExpectation);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if disc is not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await bookService.getById(fakeId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(Error(discNotFound));
                }
            });
        });

        describe('Update Method', () => {
            it('Updates a specific disc', async () => {
                try {
                    const discList = await discService.getAll();
                    const disc: Disc = getCleanedResponse(discList[0]);
                    const updatedDisc = {
                        ...disc,
                        checkedOut: !disc.checkedOut
                    };
                    await discService.update(discList[0]._id, updatedDisc);
                    const actualUpdate = await discService.getById(
                        discList[0]._id
                    );
                    expect(actualUpdate!._id).toEqual(discList[0]._id);
                    const cleanedResponse = getCleanedResponse(actualUpdate);
                    expect(cleanedResponse).toEqual(updatedDisc);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if disc not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await discService.update(fakeId, testDisc);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(discNotFound);
                }
            });
        });

        describe('Delete Method', () => {
            it('Deletes a specified disc from the database', async () => {
                try {
                    const discList = await discService.getAll();
                    const id = discList[0]._id;
                    await discService.delete(id);
                    const actualDisc = await discService.getById(id);
                    expect(actualDisc).toBeNull();
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });
    });

    describe('Disc route requests [(Request) -> App -> Controller -> Service -> Model -> DB]', () => {
        let token: string | null;
        beforeAll(async () => {
            await connect([connectOptions.dropDiscs]);
            token = await login();
        });

        afterAll(async () => {
            await disconnect();
        });

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testDisc: Disc = {
            title: 'test',
            checkedOut: true,
            checkedOutBy: item1,
            physical: true,
            digital: true,
            series: item2,
            publisher: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehost.com',
            location: 'test',
            format: [discFormats[0], discFormats[1]],
            languages: ['English', 'Test'],
            subtitles: ['English', 'Test'],
            volume: 3,
            studio: item2,
            isCollection: false
        };

        describe('(Create) /discs | POST', () => {
            it('Adds a disc to the database', async () => {
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: testDisc })
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(postResponse.body);
                expect(postResponse.status).toEqual(200);
                expect(cleanedResponse).toEqual(testDisc);
            });

            it('Rejects when title not included', async () => {
                const { title, ...discWithoutTitle } = testDisc;
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: discWithoutTitle })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: titleIsRequired
                });
            });
            it('Rejects when physical not included', async () => {
                const { physical, ...discWithoutPhysical } = testDisc;
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: discWithoutPhysical })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: physicalRequired
                });
            });
            it('Rejects when digital not included', async () => {
                const { digital, ...discWithoutDigital } = testDisc;
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: discWithoutDigital })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: digitalRequired
                });
            });
            it('Rejects when publisher not included', async () => {
                const { publisher, ...discWithoutPublisher } = testDisc;
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: discWithoutPublisher })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: publisherRequired
                });
            });
            it('Rejects when format not included', async () => {
                const { format, ...discWithoutFormat } = testDisc;
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: discWithoutFormat })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: formatIsRequired
                });
            });
            it('Rejects when format is invalid', async () => {
                const discWithInvalidFormat = {
                    ...testDisc,
                    format: ['test']
                };
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: discWithInvalidFormat })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: invalidFormat
                });
            });
            it('Rejects when languages not included', async () => {
                const { languages, ...discWithoutLanguages } = testDisc;
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: discWithoutLanguages })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: discLanguageIsRequired
                });
            });
            it('Rejects when volume is invalid', async () => {
                const discWithInvalidVolume = {
                    ...testDisc,
                    volume: -1
                };
                const postResponse = await request(app)
                    .post('/discs')
                    .send({ data: discWithInvalidVolume })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: mustBePostive
                });
            });
        });

        describe('(Get All) /discs | GET', () => {
            it('Returns a full list of discs', async () => {
                const getResponse = await request(app)
                    .get('/discs')
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(getResponse.body);
                const expectedResponse = [testDisc];
                expect(cleanedResponse).toEqual(expectedResponse);
            });
        });

        describe('(Get By Id) /discs/:id | GET', () => {
            it('Successfully retrieves a disc by id', async () => {
                const getResponse = await request(app)
                    .get('/discs')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;
                const expectedDisc = getResponse.body[0];

                const getByIdResponse = await request(app)
                    .get(`/discs/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(200);
                expect(getByIdResponse.body).toEqual(expectedDisc);
            });

            it('Returns an error if disc not found', async () => {
                const randomId: string = mongoose.Types.ObjectId().toHexString();
                const getResponse = await request(app)
                    .get(`/discs/${randomId}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(404);
                expect(getResponse.error).toBeDefined();
            });
        });

        describe('(Update) /discs/:id | PUT', () => {
            let id: string;
            let expectedDisc: any;

            beforeAll(async () => {
                const getResponse = await request(app)
                    .get('/discs')
                    .set('Authorization', 'Bearer ' + token);
                expectedDisc = getCleanedResponse(getResponse.body[0]);
                id = getResponse.body[0]._id;
            });

            it('Successfully updates the selected book', async () => {
                const expectedUpdate = {
                    ...expectedDisc,
                    checkedOut: !expectedDisc.checkedOut
                };

                const putResponse = await request(app)
                    .put(`/discs/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });
                expect(putResponse.status).toEqual(200);
                const cleanedResponse = getCleanedResponse(putResponse.body);
                expect(cleanedResponse).toEqual(expectedUpdate);
            });
        });

        describe('(Delete) /discs/:id | DELETE', () => {
            it('Successfully deletes the disc with selected id', async () => {
                // Get id from first disc returned
                const getResponse = await request(app)
                    .get('/discs')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;

                // Use id to delete disc
                const deleteResponse = await request(app)
                    .delete(`/discs/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(deleteResponse.status).toEqual(200);
                expect(deleteResponse.body).toEqual({});

                // Expect disc to no longer by in DB
                const getByIdResponse = await request(app)
                    .get(`/discs/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(404);
                expect(getByIdResponse.error).toBeDefined();
            });
        });
    });

    describe('Game Service Calls [Service -> Model -> DB]', () => {
        beforeAll(async () => {
            await connect([connectOptions.dropGames]);
        });
        afterAll(async () => {
            await disconnect();
        });

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testGame: Game = {
            title: 'test',
            checkedOut: true,
            checkedOutBy: item1,
            physical: true,
            digital: true,
            series: item2,
            publisher: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehost.com',
            location: 'test',
            platforms: [item1, item2],
            languages: ['English', 'Test'],
            multiplayer: true,
            genre: 'test'
        };

        describe('Get Method | Empty DB', () => {
            it('Returns an empty array', async () => {
                try {
                    const games = await gameService.getAll();
                    expect(games).toEqual([]);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Create Method', () => {
            it('Adds a game to the database', async () => {
                try {
                    const game: Game = await gameService.create(testGame);
                    const cleanedResponse = getCleanedResponse(game);
                    expect(cleanedResponse).toEqual(testGame);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('Get By Id Method', () => {
            it('Retrives a specific game from the database', async () => {
                try {
                    const gameList = await gameService.getAll();
                    const expectedGame = gameList[0];
                    const game = await gameService.getById(expectedGame._id);
                    expect(game!._id).toEqual(expectedGame._id);
                    const cleanedResponse = getCleanedResponse(game);
                    const cleanedExpectation = getCleanedResponse(expectedGame);
                    expect(cleanedResponse).toEqual(cleanedExpectation);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if game is not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await gameService.getById(fakeId);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(Error(gameNotFound));
                }
            });
        });

        describe('Update Method', () => {
            it('Updates a specific game', async () => {
                try {
                    const gameList = await gameService.getAll();
                    const game: Game = getCleanedResponse(gameList[0]);
                    const updatedGame = {
                        ...game,
                        checkedOut: !game.checkedOut
                    };
                    await gameService.update(gameList[0]._id, updatedGame);
                    const actualUpdate = await gameService.getById(
                        gameList[0]._id
                    );
                    expect(actualUpdate!._id).toEqual(gameList[0]._id);
                    const cleanedResponse = getCleanedResponse(actualUpdate);
                    expect(cleanedResponse).toEqual(updatedGame);
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });

            it('Returns an error if game not found', async () => {
                try {
                    const fakeId = mongoose.Types.ObjectId().toHexString();
                    await gameService.update(fakeId, testGame);
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(gameNotFound);
                }
            });
        });

        describe('Delete Method', () => {
            it('Deletes a specific game from the database', async () => {
                try {
                    const gameList = await gameService.getAll();
                    const id = gameList[0]._id;
                    await gameService.delete(id);
                    const actualGame = await gameService.getById(id);
                    expect(actualGame).toBeNull();
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });
    });

    describe('Game route requests [(Request) -> App -> Controller -> Service -> Model -> DB]', () => {
        let token: string | null;
        beforeAll(async () => {
            await connect([connectOptions.dropGames]);
            token = await login();
        });
        afterAll(async () => {
            await disconnect();
        });

        const item1 = mongoose.Types.ObjectId().toHexString();
        const item2 = mongoose.Types.ObjectId().toHexString();
        const testGame: Game = {
            title: 'test',
            checkedOut: true,
            checkedOutBy: item1,
            physical: true,
            digital: true,
            series: item2,
            publisher: item1,
            listPrice: '$616.00',
            image: 'http://www.imagehost.com',
            location: 'test',
            platforms: [item1, item2],
            languages: ['English', 'Test'],
            multiplayer: true,
            genre: 'test'
        };

        describe('(Create) /games | POST', () => {
            it('Adds a game to the database', async () => {
                const postResponse = await request(app)
                    .post('/games')
                    .send({ data: testGame })
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(postResponse.body);
                expect(postResponse.status).toEqual(200);
                expect(cleanedResponse).toEqual(testGame);
            });

            it('Rejects when title is not included', async () => {
                const { title, ...gameWithoutTitle } = testGame;
                const postResponse = await request(app)
                    .post('/games')
                    .send({ data: gameWithoutTitle })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: titleIsRequired
                });
            });
            it('Rejects when physical is not included', async () => {
                const { physical, ...gameWithoutPhysical } = testGame;
                const postResponse = await request(app)
                    .post('/games')
                    .send({ data: gameWithoutPhysical })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: physicalRequired
                });
            });
            it('Rejects when digital is not included', async () => {
                const { digital, ...gameWithoutDigital } = testGame;
                const postResponse = await request(app)
                    .post('/games')
                    .send({ data: gameWithoutDigital })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: digitalRequired
                });
            });
            it('Rejects when publisher is not included', async () => {
                const { publisher, ...gameWithoutPublisher } = testGame;
                const postResponse = await request(app)
                    .post('/games')
                    .send({ data: gameWithoutPublisher })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: publisherRequired
                });
            });
            it('Rejects when platforms is not included', async () => {
                const { platforms, ...gameWithoutPlatforms } = testGame;
                const postResponse = await request(app)
                    .post('/games')
                    .send({ data: gameWithoutPlatforms })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: platformIsRequired
                });
            });

            it('Rejects when multiplayer is not included', async () => {
                const { multiplayer, ...gameWithoutMultiplayer } = testGame;
                const postResponse = await request(app)
                    .post('/games')
                    .send({ data: gameWithoutMultiplayer })
                    .set('Authorization', 'Bearer ' + token);
                expect(postResponse.status).toEqual(400);
                expect(postResponse.error).toBeDefined();
                expect(postResponse.body).toEqual({
                    message: multiplayerMustBeIndicated
                });
            });
        });

        describe('(Get All) /games | GET', () => {
            it('Returns a full list of games', async () => {
                const getResponse = await request(app)
                    .get('/games')
                    .set('Authorization', 'Bearer ' + token);
                const cleanedResponse = getCleanedResponse(getResponse.body);
                const expectedResponse = [testGame];
                expect(cleanedResponse).toEqual(expectedResponse);
            });
        });

        describe('(Get By Id) /games/:id | GET', () => {
            it('Successfully retrieves a game by id', async () => {
                const getResponse = await request(app)
                    .get('/games')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;
                const expectedDisc = getResponse.body[0];

                const getByIdResponse = await request(app)
                    .get(`/games/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(200);
                expect(getByIdResponse.body).toEqual(expectedDisc);
            });

            it('Returns an error if game not found', async () => {
                const randomId: string = mongoose.Types.ObjectId().toHexString();
                const getResponse = await request(app)
                    .get(`/games/${randomId}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(404);
                expect(getResponse.error).toBeDefined();
            });
        });

        describe('(Update) /games/:id | PUT', () => {
            let id: string;
            let expectedGame: any;

            beforeAll(async () => {
                const getResponse = await request(app)
                    .get('/games')
                    .set('Authorization', 'Bearer ' + token);
                expectedGame = getCleanedResponse(getResponse.body[0]);
                id = getResponse.body[0]._id;
            });

            it('Successfully updates the selected book', async () => {
                const expectedUpdate = {
                    ...expectedGame,
                    checkedOut: !expectedGame.checkedOut
                };

                const putResponse = await request(app)
                    .put(`/games/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({ data: expectedUpdate });
                expect(putResponse.status).toEqual(200);
                const cleanedResponse = getCleanedResponse(putResponse.body);
                expect(cleanedResponse).toEqual(expectedUpdate);
            });
        });

        describe('(Delete) /games/:id | DELETE', () => {
            it('Successfully deletes the game with selected id', async () => {
                // Get id from first game returned
                const getResponse = await request(app)
                    .get('/games')
                    .set('Authorization', 'Bearer ' + token);
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.length).toEqual(1);
                expect(getResponse.body[0]._id).toBeDefined();
                const id = getResponse.body[0]._id;

                // Use id to delete game
                const deleteResponse = await request(app)
                    .delete(`/games/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(deleteResponse.status).toEqual(200);
                expect(deleteResponse.body).toEqual({});

                // Expect game to no longer by in DB
                const getByIdResponse = await request(app)
                    .get(`/games/${id}`)
                    .set('Authorization', 'Bearer ' + token);
                expect(getByIdResponse.status).toEqual(404);
                expect(getByIdResponse.error).toBeDefined();
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

import {
    _delete,
    register,
    authenticate,
    getAll,
    getById,
    update
} from '../user.requestHandlers';
import { userService } from '../user.service';
import { userSchema } from '../../../client/src/lib/schemas/user.schema';
import { NextFunction } from 'connect';
import { IUser } from '../user.interface';

describe('User Controller', () => {
    let next: NextFunction;
    const testId: string = 'test';
    const testUser = {
        username: 'test',
        password: 'test',
        email: 'test@test.com'
    };
    beforeAll(() => {
        next = jest.fn();
    });

    describe('Authentication Handler', () => {
        const req: any = {
            body: {
                data: testUser
            }
        };
        const res: any = {};

        it('Calls authenticate from service with expected parameters', async () => {
            userService.authenticate = jest.fn(() => {
                return Promise.resolve();
            });
            await authenticate(req, res, next);
            expect(userService.authenticate).toHaveBeenCalledWith(testUser);
        });

        it('Calls next when an error is thrown', async () => {
            userService.authenticate = jest.fn(() => {
                return Promise.reject();
            });
            await authenticate(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('Register Handler', () => {
        // Set up shared parameters
        const req: any = {
            body: {
                data: testUser
            }
        };
        const res: any = {};
        userSchema.validate = jest.fn();

        it('Calls validate & create from service with expected parameters', async () => {
            userService.create = jest.fn();
            await register(req, res, next);
            expect(userSchema.validate).toHaveBeenCalledWith(testUser);
            expect(userService.create).toHaveBeenCalledWith(testUser);
        });

        it('Calls next when an error from create is thrown', async () => {
            userService.create = jest.fn(() => {
                throw new Error();
            });
            await register(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('Calls next and ceases function when error from validate is thrown', async () => {
            userSchema.validate = jest.fn(() => {
                throw new Error();
            });
            userService.create = jest.fn();
            await register(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(userSchema.validate).toHaveBeenCalled();
            expect(userService.create).toHaveBeenCalledTimes(0);
        });
    });

    describe('Get All Handler', () => {
        const req: any = {};
        const res: any = {};

        it('Calls getAll from service', async () => {
            const mockData: IUser[] = [];
            userService.getAll = jest.fn(() => {
                return Promise.resolve(mockData);
            });
            await getAll(req, res, next);
            expect(userService.getAll).toHaveBeenCalled();
        });

        it('Calls next when an error is thrown', async () => {
            userService.getAll = jest.fn(() => {
                return Promise.reject();
            });
            await getAll(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('Get By ID handler', () => {
        const req: any = {
            params: {
                id: testId
            }
        };
        const res: any = {};

        it('Calls getById from service with expected parameters', async () => {
            userService.getById = jest.fn(() => {
                return Promise.resolve(null);
            });
            await getById(req, res, next);
            expect(userService.getById).toHaveBeenCalledWith(testId);
        });

        it('Calls next when an error is thrown', async () => {
            userService.getById = jest.fn(() => {
                return Promise.reject();
            });
            await getById(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('Update Handler', () => {
        const req: any = {
            params: {
                id: testId
            },
            body: {
                data: testUser
            }
        };
        const res: any = {};

        it('Calls update from the service with expected parameters', async () => {
            userSchema.validate = jest.fn();
            userService.update = jest.fn();
            await update(req, res, next);
            expect(userService.update).toHaveBeenCalledWith(testId, testUser);
        });

        it('Calls validate from the service with expected parameters', async () => {
            userService.update = jest.fn();
            await update(req, res, next);
            expect(userSchema.validate).toHaveBeenCalledWith(testUser);
        });

        it('Calls next when an error from update is thrown', async () => {
            userService.update = jest.fn(() => {
                throw new Error();
            });
            await update(req, res, next);
            expect(userSchema.validate).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });

        it('Calls next and ceases function when an error from validate is thrown', async () => {
            userService.update = jest.fn();
            userSchema.validate = jest.fn(() => {
                throw new Error();
            });
            await update(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(userSchema.validate).toHaveBeenCalled();
            expect(userService.update).toHaveBeenCalledTimes(0);
        });
    });

    describe('Delete Handler', () => {
        const req: any = {
            params: {
                id: testId
            }
        };
        const res: any = {};

        it('Calls delete from service with expected parameters', async () => {
            userService.delete = jest.fn();
            await _delete(req, res, next);
            expect(userService.delete).toHaveBeenCalled();
            expect(userService.delete).toHaveBeenCalledWith(testId);
        });

        it('Calls next function when error is thrown', async () => {
            userService.delete = jest.fn(() => {
                throw new Error();
            });
            await _delete(res, req, next);
            expect(next).toHaveBeenCalled();
        });
    });
});

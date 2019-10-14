import User from '../user.model';
import { userService } from '../user.service';
import {
    duplicateEmail,
    duplicateUsername
} from '../../../lib/messages/user.errorMessages';

describe('User Service', () => {
    const mockDocumentQuery: any = {
        select: jest.fn(),
        save: jest.fn()
    };

    describe('Create', () => {
        const testUser = {
            username: 'test',
            password: 'test',
            email: 'test@test.com',
            createdDate: new Date()
        };

        it('Checks if the user is already in the database', async () => {
            try {
                User.findOne = jest.fn(() => {
                    return mockDocumentQuery;
                });
                await userService.create(testUser);
                expect(User.find).toHaveBeenCalledWith({
                    username: testUser.username
                });
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toEqual(duplicateUsername);
            }
        });

        it('Checks if the email is already in the database', async () => {
            try {
                User.findOne = jest.fn(({ email, username }) => {
                    // Return false on the other findOne call to get past the duplicate
                    // username check
                    if (email) {
                        return mockDocumentQuery;
                    }
                    return false;
                });
                await userService.create(testUser);
                expect(User.find).toHaveBeenCalledWith({
                    email: testUser.email
                });
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toEqual(duplicateEmail);
            }
        });
    });

    describe('Get All', () => {
        it('Calls find() on the model and select() on the result', async () => {
            User.find = jest.fn(() => {
                return mockDocumentQuery;
            });
            await userService.getAll();
            expect(User.find).toHaveBeenCalled();
            expect(mockDocumentQuery.select).toHaveBeenCalledWith('-hash');
        });
    });

    describe('Get By ID', () => {
        it('Calls findOne() on the model and select on the result', async () => {
            const testId = 'test';
            User.findOne = jest.fn(() => {
                return mockDocumentQuery;
            });
            await userService.getById(testId);
            expect(User.findOne).toHaveBeenCalledWith(
                { _id: testId },
                undefined,
                undefined,
                undefined
            );
            expect(mockDocumentQuery.select).toHaveBeenCalledWith('-hash');
        });
    });

    describe('Delete', () => {
        it('Calls findByIdAndRemove with expected parameters', async () => {
            const testId = 'test';
            User.findByIdAndRemove = jest.fn(() => {
                return mockDocumentQuery;
            });
            await userService.delete(testId);
            expect(User.findByIdAndRemove).toHaveBeenCalledWith(testId);
        });
    });
});

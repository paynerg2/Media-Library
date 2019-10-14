import { userSchema } from '../../../lib/schemas/user.schema';
import {
    invalidEmail,
    passwordNotLongEnough,
    usernameNotLongEnough,
    emailNotLongEnough,
    usernameIsRequired,
    passwordIsRequired,
    emailIsRequired
} from '../../../lib/messages/user.errorMessages';

describe('User Schema', () => {
    const validateUser = async (user: any) => {
        let error;
        try {
            await userSchema.validate(user);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when proper fields are present', async () => {
        const testUser = {
            username: 'test',
            email: 'test@test.com',
            password: 'testPassword',
            createdDate: new Date()
        };
        const testUser2 = {
            username: 'test',
            email: 'test@test.com',
            password: 'testPassword'
        };

        const error = await validateUser(testUser);
        const error2 = await validateUser(testUser2);
        expect(error).toBeUndefined();
        expect(error2).toBeUndefined();
    });

    it('Rejects usernames that are too short', async () => {
        const testUser = {
            username: 'tst',
            email: 'test@test.com',
            password: 'testPassword'
        };

        const error = await validateUser(testUser);
        expect(error.path).toEqual('username');
        expect(error.message).toEqual(usernameNotLongEnough);
    });

    it('Rejects when username is missing', async () => {
        const testUser = {
            email: 'test@test.com',
            password: 'testPassword'
        };

        const error = await validateUser(testUser);
        expect(error.path).toEqual('username');
        expect(error.message).toEqual(usernameIsRequired);
    });

    it('Rejects passwords that are too short', async () => {
        const testUser = {
            username: 'test',
            email: 'test@test.com',
            password: 'tst'
        };

        const error = await validateUser(testUser);
        expect(error.path).toEqual('password');
        expect(error.message).toEqual(passwordNotLongEnough);
    });

    it('Rejects when password is missing', async () => {
        const testUser = {
            username: 'test',
            email: 'test@test.com'
        };

        const error = await validateUser(testUser);
        expect(error.path).toEqual('password');
        expect(error.message).toEqual(passwordIsRequired);
    });

    it('Rejects emails that are too short', async () => {
        const testUser = {
            username: 'test',
            email: 'tst',
            password: 'test'
        };

        const error = await validateUser(testUser);
        expect(error.path).toEqual('email');
        expect(error.message).toEqual(emailNotLongEnough);
    });

    it('Rejects invalid email format', async () => {
        const testUser = {
            username: 'test',
            email: 'tsttsttst',
            password: 'test'
        };

        const error = await validateUser(testUser);
        expect(error.path).toEqual('email');
        expect(error.message).toEqual(invalidEmail);
    });

    it('Rejects if email is missing', async () => {
        const testUser = {
            username: 'test',
            password: 'test'
        };

        const error = await validateUser(testUser);
        expect(error.path).toEqual('email');
        expect(error.message).toEqual(emailIsRequired);
    });

    it('Rejects date if not able to cast to date type', async () => {
        const testUser = {
            username: 'test',
            email: 'test@test.com',
            password: 'test',
            createdDate: 'test'
        };

        const error = await validateUser(testUser);
        expect(error.path).toEqual('createdDate');
        // Keeping this error message because it's informative
        expect(error.message).toEqual(
            'createdDate must be a `date` type, but the final value was: `Invalid Date` (cast from the value `"test"`).'
        );
    });
});

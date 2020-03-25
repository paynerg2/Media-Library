import { loginSchema } from '../login.schema';
import {
    passwordIsRequired,
    usernameIsRequired
} from '../../messages/user.errorMessages';

describe('Login Schema', () => {
    const validateLogin = async (loginCredentials: any) => {
        let error;
        try {
            await loginSchema.validate(loginCredentials);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when all required fields are present', async () => {
        const testCredentials = {
            username: 'test',
            password: 'test'
        };
        const error = await validateLogin(testCredentials);
        expect(error).toBeUndefined();
    });

    it('Returns an error if username not present', async () => {
        const testCredentials = {
            password: 'test'
        };
        const error = await validateLogin(testCredentials);
        expect(error.path).toEqual('username');
        expect(error.message).toEqual(usernameIsRequired);
    });

    it('Returns an erorr if password not present', async () => {
        const testCredentials = {
            username: 'test'
        };
        const error = await validateLogin(testCredentials);
        expect(error.path).toEqual('password');
        expect(error.message).toEqual(passwordIsRequired);
    });
});

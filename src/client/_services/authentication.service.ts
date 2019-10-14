import axios from '../_helpers/axios';
import { AxiosRequestConfig } from 'axios';
import { AuthenticatedUser } from '../_interfaces';

const login = async (
    username: String,
    password: String
): Promise<AuthenticatedUser> => {
    const options: AxiosRequestConfig = {
        data: { username, password }
    };
    try {
        const response = await axios.post('/users/authenticate', options);
        const user: AuthenticatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (err) {
        throw err;
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

export const authenticationService = {
    login,
    logout
};

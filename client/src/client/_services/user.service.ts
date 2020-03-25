import axios from '../_helpers/axios';
import { AxiosRequestConfig } from 'axios';
import { User } from '../_interfaces';

const create = async (user: User) => {
    const options: AxiosRequestConfig = {
        data: user
    };
    try {
        await axios.post('/users/register', options);
    } catch (err) {
        throw Error(`User Registration Unsuccessful: ${err.message}`);
    }
};

export const userService = {
    create
};

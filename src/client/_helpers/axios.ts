import axios from 'axios';
import { env } from './env';
import { authHeader } from './auth-header';

const config = {
    baseURL: env.apiUrl,
    headers: { ...authHeader(), 'Content-Type': 'application/json' }
};

export default axios.create(config);

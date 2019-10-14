import * as yup from 'yup';
import {
    passwordIsRequired,
    usernameIsRequired
} from '../messages/user.errorMessages';

export const loginSchema: yup.ObjectSchema = yup.object().shape({
    username: yup.string().required(usernameIsRequired),
    password: yup.string().required(passwordIsRequired)
});

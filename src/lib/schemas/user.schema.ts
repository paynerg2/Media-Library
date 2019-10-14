import * as yup from 'yup';
import {
    invalidEmail,
    passwordNotLongEnough,
    usernameNotLongEnough,
    emailNotLongEnough,
    usernameIsRequired,
    emailIsRequired,
    passwordIsRequired
} from '../messages/user.errorMessages';

export const userSchema: yup.ObjectSchema = yup.object().shape({
    username: yup
        .string()
        .required(usernameIsRequired)
        .min(4, usernameNotLongEnough)
        .max(255),
    email: yup
        .string()
        .min(5, emailNotLongEnough)
        .email(invalidEmail)
        .max(255)
        .required(emailIsRequired),
    password: yup
        .string()
        .min(4, passwordNotLongEnough)
        .max(255)
        .required(passwordIsRequired),
    createdDate: yup.date().default(() => new Date())
});

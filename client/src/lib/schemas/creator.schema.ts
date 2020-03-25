import * as yup from 'yup';
import { firstNameIsRequired } from '../messages/creator.errorMessages';

export const creatorSchema: yup.ObjectSchema = yup.object().shape({
    firstName: yup.string().required(firstNameIsRequired),
    middleInitials: yup.string(),
    lastName: yup.string(),
    works: yup.array().default([])
});

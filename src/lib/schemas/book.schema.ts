import * as yup from 'yup';
import { itemSchema } from './';
import { bookTypes } from '../formats';
import {
    authorIsRequired,
    invalidType,
    typeIsRequired,
    languageIsRequired,
    volumeMustBePositive
} from '../messages/book.errorMessages';

export const bookSchema: yup.ObjectSchema = itemSchema.shape({
    authors: yup
        .array()
        .of(yup.string())
        .required(authorIsRequired),
    colorers: yup.array().of(yup.string()),
    letterers: yup.array().of(yup.string()),
    type: yup
        .string()
        .lowercase()
        .oneOf(bookTypes, invalidType)
        .required(typeIsRequired),
    language: yup.string().required(languageIsRequired),
    volume: yup.number().positive(volumeMustBePositive),
    isbn: yup.string()
});

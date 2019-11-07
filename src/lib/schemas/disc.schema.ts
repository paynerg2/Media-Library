import * as yup from 'yup';
import { itemSchema } from './item.schema';
import { discFormats } from '../formats';
import {
    formatIsRequired,
    invalidFormat,
    mustBePostive
} from '../messages/disc.errorMessages';
import { discLanguageIsRequired } from '../messages/disc.errorMessages';

export const discSchema: yup.ObjectSchema = itemSchema.shape({
    format: yup
        .array()
        .of(
            yup
                .string()
                .lowercase()
                .oneOf(discFormats, invalidFormat)
        )
        .required(formatIsRequired),
    languages: yup
        .array()
        .of(yup.string())
        .required(discLanguageIsRequired),
    subtitles: yup.array().of(yup.string()),
    volume: yup.number().positive(mustBePostive),
    director: yup.string(),
    studio: yup.string(),
    isCollection: yup.boolean().default(false)
});

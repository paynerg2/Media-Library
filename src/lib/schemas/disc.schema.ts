import * as yup from 'yup';
import { itemSchema } from './item.schema';
import { discFormats } from '../formats';
import { formatIsRequired } from '../messages/disc.errorMessages';
import { languageIsRequired } from '../messages/disc.errorMessages';

export const discSchema: yup.ObjectSchema = itemSchema.shape({
    format: yup
        .array()
        .of(
            yup
                .string()
                .lowercase()
                .oneOf(discFormats)
        )
        .required(formatIsRequired),
    languages: yup
        .array()
        .of(yup.string())
        .required(languageIsRequired),
    subtitles: yup.array().of(yup.string()),
    volume: yup.number().positive(),
    director: yup.string(),
    studio: yup.string(),
    isCollection: yup.boolean().default(false)
});

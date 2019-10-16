import * as yup from 'yup';
import { seriesNameIsRequired } from '../messages/series.errorMessages';

export const seriesSchema: yup.ObjectSchema = yup.object().shape({
    name: yup.string().required(seriesNameIsRequired),
    items: yup.array().default([])
});

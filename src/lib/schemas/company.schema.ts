import * as yup from 'yup';
import {
    companyNameIsRequired,
    invalidUrl,
    invalidStatus,
    timeTravellingNotAllowed
} from '../messages/company.errorMessages';

export const companySchema: yup.ObjectSchema = yup.object().shape({
    name: yup.string().required(companyNameIsRequired),
    titles: yup
        .array()
        .of(yup.string())
        .default([]),
    founded: yup.date().max(new Date(), timeTravellingNotAllowed),
    founder: yup.string(),
    headquarters: yup.string(),
    owners: yup.array().of(yup.string()),
    predecessor: yup.string(),
    parent: yup.string(),
    website: yup.string().url(invalidUrl),
    status: yup.string().oneOf(['Active', 'Inactive'], invalidStatus)
});

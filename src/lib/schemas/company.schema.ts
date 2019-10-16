import * as yup from 'yup';
import { companyNameIsRequired } from '../messages/company.errorMessages';

export const companySchema: yup.ObjectSchema = yup.object().shape({
    name: yup.string().required(companyNameIsRequired),
    works: yup.array().default([])
});

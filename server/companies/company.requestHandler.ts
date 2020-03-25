import { getRequestHandler } from '../_helpers/getRequestHandler';
import { ICompany } from './company.interface';
import { Company } from '../../client/src/lib/interfaces';

export const companyRequestHandler = getRequestHandler<Company, ICompany>(
    'company'
);

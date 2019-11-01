import { companyConstants } from '../_constants';
import { companyService } from '../_services';
import { getActions } from './getActions';
import { Company } from '../../lib/interfaces';

export const companyActions = getActions<Company>(
    companyService,
    companyConstants
);

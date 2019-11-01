import { Company } from '../../lib/interfaces';
import { getService } from './service';

export const companyService = getService<Company>('company');

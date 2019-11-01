import { StringTMap } from './stringTMap.interface';
import { Company } from '../../lib/interfaces';

export interface CompanyState {
    allIds: String[];
    byId: StringTMap<Company>;
    selectedCompany: String | null;
    loading: Boolean;
    error?: Error;
}

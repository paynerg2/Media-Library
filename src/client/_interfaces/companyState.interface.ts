import { Company } from '../../lib/interfaces';
import { State } from './state.interface';
import { StringTMap } from './stringTMap.interface';

export interface CompanyState extends State<Company> {
    selectedCompany: string | null;
    byName: StringTMap<string>;
}

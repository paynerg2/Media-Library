import { Company } from '../../lib/interfaces';
import { State } from './state.interface';

export interface CompanyState extends State<Company> {
    selectedCompany: string | null;
}

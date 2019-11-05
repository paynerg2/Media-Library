import { StringTMap } from './stringTMap.interface';
import { Book } from '../../lib/interfaces';

export interface BookState {
    allIds: String[];
    byId: StringTMap<Book>;
    selectedCompany: String | null;
    loading: Boolean;
    error?: Error;
}

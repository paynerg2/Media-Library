import { Book } from '../../lib/interfaces';
import { State } from './state.interface';
import { StringTMap } from './stringTMap.interface';

export interface BookState extends State<Book> {
    selectedBook: string | null;
    bySeriesName: StringTMap<Array<string>>;
}

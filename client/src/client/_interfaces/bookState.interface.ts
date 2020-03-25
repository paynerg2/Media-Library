import { Book } from '../../lib/interfaces';
import { State } from './state.interface';

export interface BookState extends State<Book> {
    selectedBook: string | null;
}

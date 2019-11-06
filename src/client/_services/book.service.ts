import { Book } from '../../lib/interfaces';
import { getService } from './service';

export const bookService = getService<Book>('books');

import { getRequestHandler } from '../_helpers/getRequestHandler';
import { IBook } from './book.interface';
import { Book } from '../../client/src/lib/interfaces';

export const bookRequestHandler = getRequestHandler<Book, IBook>('book');

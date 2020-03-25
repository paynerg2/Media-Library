import { getRequestHandler } from '../_helpers/getRequestHandler';
import { IBook } from './book.interface';
import { Book } from '../../lib/interfaces';

export const bookRequestHandler = getRequestHandler<Book, IBook>('book');

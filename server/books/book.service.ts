import Book from './book.model';
import { IBook } from './book.interface';
import { Book as BookParams } from '../../client/src/lib/interfaces';
import { IService } from '../_interfaces/service.interface';
import { getSimpleService } from '../_helpers/getSimpleService';
import { bookNotFound } from '../../client/src/lib/messages/book.errorMessages';

const errorMessages = {
    getById: bookNotFound,
    update: bookNotFound
};

export const bookService: IService<BookParams, IBook> = getSimpleService<
    BookParams,
    IBook
>(Book, errorMessages);

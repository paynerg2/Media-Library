import { Book } from '../../lib/interfaces';
import { useItemIds } from '.';
import { StringTMap } from '../_interfaces/stringTMap.interface';
import { filterByKeys } from '../_helpers/filterByKeys';
import { useSelector } from '.';

export const useBooks = (id: string, type: string): Book[] => {
    const [bookIds] = useItemIds(id, type);
    const booksObject: StringTMap<Book> = useSelector(state =>
        filterByKeys(state.books.byId, bookIds)
    );
    const books = bookIds.map(id => booksObject[id]);
    return books;
};

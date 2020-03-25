import { bookConstants } from '../_constants';
import { bookService } from '../_services';
import { getActions } from './getActions';
import { Book } from '../../lib/interfaces';

export const bookActions = getActions<Book>(bookService, bookConstants);

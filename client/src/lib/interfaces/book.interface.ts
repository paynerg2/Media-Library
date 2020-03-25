import { Item, defaultItem } from './item.interface';
import { bookTypes } from '../formats';

export interface Book extends Item {
    authors: Array<string>;
    language: string;
    type: string;
    artists?: Array<string>;
    colorer?: Array<string>;
    letterer?: Array<string>;
    volume?: number;
    isbn?: string;
}

export const defaultBook: Book = {
    ...defaultItem,
    authors: [],
    language: '',
    type: bookTypes[0],
    artists: [],
    colorer: [],
    letterer: [],
    volume: 1,
    isbn: ''
};

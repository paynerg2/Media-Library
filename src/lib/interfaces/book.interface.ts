import { Item, defaultItem } from './item.interface';

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
    type: '',
    artists: [],
    colorer: [],
    letterer: [],
    volume: 1,
    isbn: ''
};

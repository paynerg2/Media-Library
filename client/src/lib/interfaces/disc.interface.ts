import { Item, defaultItem } from './item.interface';
import { discFormats } from '../formats';

export interface Disc extends Item {
    format: Array<string>;
    isCollection: boolean;
    languages: Array<string>;
    subtitles?: Array<string>;
    volume?: number;
    director?: string;
    studio?: string;
}

export const defaultDisc: Disc = {
    ...defaultItem,
    format: [discFormats[0]],
    isCollection: false,
    languages: [],
    subtitles: [],
    volume: 1,
    director: '',
    studio: ''
};

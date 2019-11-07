import { Item } from './item.interface';

export interface Disc extends Item {
    format: Array<string>;
    isCollection: boolean;
    languages: Array<string>;
    subtitles?: Array<string>;
    volume?: number;
    director?: string;
    studio?: string;
}

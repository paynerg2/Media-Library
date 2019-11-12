import { Item } from './item.interface';

export interface Game extends Item {
    platforms: Array<string>;
    multiplayer: boolean;
    languages: Array<string>;
    genre: string;
}

import { Item, defaultItem } from './item.interface';

export interface Game extends Item {
    platforms: Array<string>;
    multiplayer: boolean;
    languages: Array<string>;
    genre: string;
}

export const defaultGame: Game = {
    ...defaultItem,
    platforms: [],
    multiplayer: false,
    languages: [],
    genre: ''
};

import { StringTMap } from './stringTMap.interface';
import { Game } from '../../lib/interfaces';

export interface GameState {
    allIds: String[];
    byId: StringTMap<Game>;
    selectedGame: String | null;
    loading: Boolean;
    error?: Error;
}

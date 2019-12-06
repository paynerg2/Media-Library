import { Game } from '../../lib/interfaces';
import { State } from './state.interface';
import { StringTMap } from './stringTMap.interface';

export interface GameState extends State<Game> {
    selectedGame: string | null;
    bySeriesName: StringTMap<Array<string>>;
}

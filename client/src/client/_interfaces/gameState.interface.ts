import { Game } from '../../lib/interfaces';
import { State } from './state.interface';

export interface GameState extends State<Game> {
    selectedGame: string | null;
}

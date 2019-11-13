import { Game } from '../../lib/interfaces';
import { getService } from './service';

export const gameService = getService<Game>('games');

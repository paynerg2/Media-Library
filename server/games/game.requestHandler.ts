import { getRequestHandler } from '../_helpers/getRequestHandler';
import { IGame } from './game.interface';
import { Game } from '../../client/src/lib/interfaces';

export const gameRequestHandler = getRequestHandler<Game, IGame>('game');

import { gameConstants } from '../_constants';
import { gameService } from '../_services';
import { getActions } from './getActions';
import { Game } from '../../lib/interfaces';

export const gameActions = getActions<Game>(gameService, gameConstants);

import Game from './game.model';
import { IGame } from './game.interface';
import { Game as GameParams } from '../../client/src/lib/interfaces';
import { IService } from '../_interfaces/service.interface';
import { getSimpleService } from '../_helpers/getSimpleService';
import { gameNotFound } from '../../client/src/lib/messages/game.errorMessages';

const errorMessages = {
    getById: gameNotFound,
    update: gameNotFound
};

export const gameService: IService<GameParams, IGame> = getSimpleService<
    GameParams,
    IGame
>(Game, errorMessages);

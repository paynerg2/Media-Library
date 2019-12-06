import { Game } from '../../lib/interfaces';
import { useItemIds } from '.';
import { StringTMap } from '../_interfaces/stringTMap.interface';
import { filterByKeys } from '../_helpers/filterByKeys';
import { useSelector } from '.';

export const useGames = (id: string, type: string): Game[] => {
    const [, , gameIds] = useItemIds(id, type);
    const gamesObject: StringTMap<Game> = useSelector(state =>
        filterByKeys(state.games.byId, gameIds)
    );
    const games = gameIds.map(id => gamesObject[id]);
    return games;
};

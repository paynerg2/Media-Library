import { Game } from '../../lib/interfaces';
import { useSelector } from '.';

export const useGame = (id: string) => {
    const game: Game = useSelector(state => state.games.byId[id]);
    console.log('game from usegame');
    console.log(game);
    const publisher = useSelector(state =>
        state.companies.allIds
            .map(id => state.companies.byId[id])
            .find(company => company.name === state.games.byId[id].publisher)
    );
    const series = useSelector(state => {
        const seriesName = state.games.byId[id].series;
        return (
            seriesName &&
            state.series.allIds
                .map(id => state.series.byId[id])
                .find(series => series.name === seriesName)
        );
    });
    return { game, series, publisher };
};

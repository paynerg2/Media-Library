import { Disc } from '../../lib/interfaces';
import { useSelector } from '.';
import { getFullName } from '../_helpers/getFullName';

export const useDisc = (id: string) => {
    const disc: Disc = useSelector(state => state.discs.byId[id]);
    const director = useSelector(state => {
        const directorName = state.discs.byId[id].director;
        return (
            directorName &&
            state.creators.allIds
                .map(id => state.creators.byId[id])
                .find(creator => getFullName(creator) === directorName)
        );
    });
    const series = useSelector(state => {
        const seriesName = state.discs.byId[id].series;
        return (
            seriesName &&
            state.series.allIds
                .map(id => state.series.byId[id])
                .find(series => series.name === seriesName)
        );
    });
    const publisher = useSelector(state =>
        state.companies.allIds
            .map(id => state.companies.byId[id])
            .find(company => company.name === state.discs.byId[id].publisher)
    );
    const studio = useSelector(state =>
        state.companies.allIds
            .map(id => state.companies.byId[id])
            .find(company => company.name === state.discs.byId[id].studio)
    );

    return { disc, director, series, studio, publisher };
};

import { Book } from '../../lib/interfaces';
import { useSelector } from '.';
import { getFullName } from '../_helpers/getFullName';

export const useBook = (id: string) => {
    const book: Book = useSelector(state => state.books.byId[id]);
    const publisher = useSelector(state =>
        state.companies.allIds
            .map(id => state.companies.byId[id])
            .find(company => company.name === state.books.byId[id].publisher)
    );
    const authors = useSelector(state => {
        const authorNames = state.books.byId[id].authors;
        return state.creators.allIds
            .map(id => state.creators.byId[id])
            .filter(author => authorNames.includes(getFullName(author)));
    });
    const artists = useSelector(state => {
        const artistNames = state.books.byId[id].artists;
        return (
            artistNames &&
            state.creators.allIds
                .map(id => state.creators.byId[id])
                .filter(artist => artistNames.includes(getFullName(artist)))
        );
    });
    const colorers = useSelector(state => {
        const colorerNames = state.books.byId[id].colorer;
        return (
            colorerNames &&
            state.creators.allIds
                .map(id => state.creators.byId[id])
                .filter(colorer => colorerNames.includes(getFullName(colorer)))
        );
    });
    const letterers = useSelector(state => {
        const lettererNames = state.books.byId[id].letterer;
        return (
            lettererNames &&
            state.creators.allIds
                .map(id => state.creators.byId[id])
                .filter(letterer =>
                    lettererNames.includes(getFullName(letterer))
                )
        );
    });
    const series = useSelector(state => {
        const seriesName = state.books.byId[id].series;
        return (
            seriesName &&
            state.series.allIds
                .map(id => state.series.byId[id])
                .find(series => series.name === seriesName)
        );
    });

    return { book, authors, artists, colorers, letterers, series, publisher };
};

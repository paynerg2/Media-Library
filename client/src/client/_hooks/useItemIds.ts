import { useSelector } from '.';

export const useItemIds = (id: string, entityType: string) => {
    const { books, discs, games, series, creators, companies } = useSelector(
        state => state
    );
    let items: Array<string>;
    if (entityType === 'series') {
        items = series.byId[id].items;
    } else if (entityType === 'company') {
        items = companies.byId[id].titles;
    } else if (entityType === 'creator') {
        items = creators.byId[id].works;
    }
    const bookIds: Array<string> = books.allIds.filter(b => items.includes(b));
    const discIds: Array<string> = discs.allIds.filter(d => items.includes(d));
    const gameIds: Array<string> = games.allIds.filter(g => items.includes(g));

    return [bookIds, discIds, gameIds];
};

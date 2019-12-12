import { useSelector } from '.';

export const useSeriesId = (name: string): string | undefined => {
    const selectedSeries = useSelector(state =>
        state.series.allIds
            .map(id => state.series.byId[id])
            .find(series => series.name === name)
    );
    return selectedSeries ? selectedSeries._id : undefined;
};

import { useSelector } from '.';

export const useSeriesId = (name: string): string => {
    return useSelector(state => state.series.byTitle[name]);
};

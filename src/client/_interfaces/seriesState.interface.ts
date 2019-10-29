import { StringTMap } from './stringTMap.interface';
import { Series } from '../../lib/interfaces/series.interface';

export interface SeriesState {
    allIds: String[];
    byId: StringTMap<Series>;
    selectedSeries: String | null;
    loading: Boolean;
    error?: Error;
}

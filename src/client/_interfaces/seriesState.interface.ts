import { StringTMap } from './stringTMap.interface';
import { Series } from './series.interface';

export interface SeriesState {
    allIds: String[];
    byId: StringTMap<Series>;
}

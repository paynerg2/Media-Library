import { Series } from '../../lib/interfaces/series.interface';
import { State } from './state.interface';
import { StringTMap } from './stringTMap.interface';

export interface SeriesState extends State<Series> {
    selectedSeries: string | null;
    byTitle: StringTMap<string>;
}

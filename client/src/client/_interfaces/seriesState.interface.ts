import { Series } from '../../lib/interfaces/series.interface';
import { State } from './state.interface';

export interface SeriesState extends State<Series> {
    selectedSeries: string | null;
}

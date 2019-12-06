import { Disc } from '../../lib/interfaces';
import { State } from './state.interface';
import { StringTMap } from './stringTMap.interface';

export interface DiscState extends State<Disc> {
    selectedDisc: string | null;
    bySeriesName: StringTMap<Array<string>>;
}

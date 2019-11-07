import { StringTMap } from './stringTMap.interface';
import { Disc } from '../../lib/interfaces';

export interface DiscState {
    allIds: String[];
    byId: StringTMap<Disc>;
    selectedDisc: String | null;
    loading: Boolean;
    error?: Error;
}

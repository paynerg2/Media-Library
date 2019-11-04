import { StringTMap } from './stringTMap.interface';
import { Creator } from '../../lib/interfaces/creator.interface';

export interface CreatorState {
    allIds: String[];
    byId: StringTMap<Creator>;
    selectedCreator: String | null;
    loading: Boolean;
    error?: Error;
}

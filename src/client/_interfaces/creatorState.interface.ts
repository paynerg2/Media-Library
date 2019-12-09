import { Creator } from '../../lib/interfaces/creator.interface';
import { State } from './state.interface';
import { StringTMap } from './stringTMap.interface';

export interface CreatorState extends State<Creator> {
    selectedCreator: string | null;
    byName: StringTMap<string>;
}

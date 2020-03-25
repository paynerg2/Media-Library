import { Creator } from '../../lib/interfaces/creator.interface';
import { State } from './state.interface';

export interface CreatorState extends State<Creator> {
    selectedCreator: string | null;
}

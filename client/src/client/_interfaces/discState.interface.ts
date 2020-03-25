import { Disc } from '../../lib/interfaces';
import { State } from './state.interface';

export interface DiscState extends State<Disc> {
    selectedDisc: string | null;
}

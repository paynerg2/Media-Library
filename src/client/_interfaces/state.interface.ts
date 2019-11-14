import { StringTMap } from './stringTMap.interface';

export interface State<T> {
    allIds: string[];
    byId: StringTMap<T>;
    loading: boolean;
    error?: Error;
}

import { StringTMap } from './stringTMap.interface';
import { MongoId } from './mongoId.interface';

export interface State<T> {
    allIds: string[];
    byId: StringTMap<T & MongoId>;
    loading: boolean;
    error?: Error;
}

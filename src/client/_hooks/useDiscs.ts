import { Disc } from '../../lib/interfaces';
import { useItemIds } from '.';
import { StringTMap } from '../_interfaces/stringTMap.interface';
import { filterByKeys } from '../_helpers/filterByKeys';
import { useSelector } from '.';

export const useDiscs = (id: string, type: string): Disc[] => {
    const [, discIds] = useItemIds(id, type);
    const discsObject: StringTMap<Disc> = useSelector(state =>
        filterByKeys(state.discs.byId, discIds)
    );
    const discs = discIds.map(id => discsObject[id]);
    return discs;
};

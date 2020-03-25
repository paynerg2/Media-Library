import { useSelector } from '.';
import { getFullName } from '../_helpers/getFullName';
import { Creator } from '../../lib/interfaces';
import { MongoId } from '../_interfaces';

export const useCreators = (authorNames: string[]): (Creator & MongoId)[] => {
    return useSelector(state =>
        state.creators.allIds
            .map(id => state.creators.byId[id])
            .filter(creator => authorNames.includes(getFullName(creator)))
    );
};

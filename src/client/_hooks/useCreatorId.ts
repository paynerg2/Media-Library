import { useSelector } from '.';
import { filterByKeys } from '../_helpers/filterByKeys';

export const useCreatorId = (authorNames: string[]): any => {
    return useSelector(state =>
        filterByKeys(state.creators.byName, authorNames)
    );
};

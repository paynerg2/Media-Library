import { useSelector } from '.';

export const useCompanyId = (name = ''): string => {
    return useSelector(state => state.companies.byName[name]);
};

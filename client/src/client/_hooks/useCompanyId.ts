import { useSelector } from '.';

export const useCompanyId = (name = ''): string | undefined => {
    const selectedCompany = useSelector(state =>
        state.companies.allIds
            .map(id => state.companies.byId[id])
            .find(company => company.name === name)
    );
    return selectedCompany ? selectedCompany._id : undefined;
};

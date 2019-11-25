import { Dispatch } from 'react';
import { StringTMap } from '../_interfaces/stringTMap.interface';
import { Creator, Series, Company } from '../../lib/interfaces';
import { creatorActions, seriesActions, companyActions } from '../_actions';

export const assureCreatorExists = (
    normalizedCollection: StringTMap<Creator>,
    dispatch: Dispatch<any>,
    creator: string,
    work: string
) => {
    const creators: string[] =
        normalizedCollection &&
        Object.values(normalizedCollection).map(creator => {
            const { firstName, lastName, middleInitials } = creator;
            let fullName = firstName;
            if (middleInitials) {
                fullName = fullName.concat(` ${middleInitials}`);
            }
            if (lastName) {
                fullName = fullName.concat(` ${lastName}`);
            }
            return fullName;
        });

    if (creators.includes(creator)) return;
    const [firstName, lastName] = creator.split(' ');
    const newCreator: Creator = {
        firstName,
        lastName,
        works: [work]
    };
    dispatch(creatorActions.create(newCreator));
};

export const assureSeriesExists = (
    normalizedCollection: StringTMap<Series>,
    dispatch: Dispatch<any>,
    name: string,
    item: string
) => {
    const series: string[] =
        normalizedCollection &&
        Object.values(normalizedCollection).map(series => series.name);
    if (series.includes(name)) return;
    const newSeries: Series = {
        name: name,
        items: [item]
    };
    dispatch(seriesActions.create(newSeries));
};

export const assureCompanyExists = (
    normalizedCollection: StringTMap<Company>,
    dispatch: Dispatch<any>,
    company: string,
    title: string
) => {
    const companies =
        normalizedCollection &&
        Object.values(normalizedCollection).map(company => company.name);
    if (companies.includes(company)) return;
    const newCompany: Company = {
        name: company,
        titles: [title]
    };
    dispatch(companyActions.create(newCompany));
};

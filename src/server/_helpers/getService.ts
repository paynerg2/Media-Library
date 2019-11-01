import { seriesService } from '../series/series.service';
import { companyService } from '../companies/company.service';
import { creatorService } from '../creators/creator.service';
export const invalidServiceType = 'Invalid service type';

export const getService = (type: string) => {
    if (type === 'series') {
        return seriesService;
    } else if (type === 'company') {
        return companyService;
    } else if (type === 'creator') {
        return creatorService;
    } else {
        throw Error(invalidServiceType);
    }
};

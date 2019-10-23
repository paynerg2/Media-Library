import { seriesService } from '../series/series.service';
const invalidServiceType = 'Invalid service type';

export const getService = (type: string) => {
    if (type === 'series') {
        return seriesService;
    } else {
        throw Error(invalidServiceType);
    }
};

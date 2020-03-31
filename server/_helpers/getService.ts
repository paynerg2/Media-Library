import { seriesService } from '../series/series.service';
import { companyService } from '../companies/company.service';
import { creatorService } from '../creators/creator.service';
import { bookService } from '../books/book.service';
import { discService } from '../discs/disc.service';
import { gameService } from '../games/game.service';

export const invalidServiceType = 'Invalid service type';

export const getService = (type: string) => {
    if (type === 'series') {
        return seriesService;
    } else if (type === 'company') {
        return companyService;
    } else if (type === 'creator') {
        return creatorService;
    } else if (type === 'book') {
        return bookService;
    } else if (type === 'disc') {
        return discService;
    } else if (type === 'game') {
        return gameService;
    } else {
        throw Error(invalidServiceType);
    }
};

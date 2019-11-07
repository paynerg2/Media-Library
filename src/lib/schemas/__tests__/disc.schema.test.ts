import { discSchema } from '../';
import {
    formatIsRequired,
    discLanguageIsRequired
} from '../../messages/disc.errorMessages';
import { validate } from '@babel/types';

describe('Disc Schema', () => {
    const validateDisc = async (disc: any) => {
        let error;
        try {
            await discSchema.validate(disc);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when all required fields are present', async () => {
        // Minimum required fields
        const testDisc = {
            title: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            format: ['dvd'],
            languages: ['test']
        };

        // All fields present'
        const testDisc2 = {
            title: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            format: ['dvd'],
            languages: ['test'],
            subtitles: ['test'],
            volume: 1,
            director: 'test',
            studio: 'test',
            isCollection: false
        };

        const error = await validateDisc(testDisc);
        const error2 = await validateDisc(testDisc2);
        expect(error).toBeUndefined();
        expect(error2).toBeUndefined();
    });

    it('Returns an error when the format field is not present or empty', async () => {
        const testDisc = {
            title: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            languages: ['test']
        };

        const testDisc2 = {
            title: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            format: [],
            languages: ['test']
        };

        const error = await validateDisc(testDisc);
        const error2 = await validateDisc(testDisc2);
        expect(error.path).toEqual('format');
        expect(error2.path).toEqual('format');
        expect(error.message).toEqual(formatIsRequired);
        expect(error2.message).toEqual(formatIsRequired);
    });

    it('Returns an error when the language field is not present or empty', async () => {
        const testDisc = {
            title: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            format: ['test']
        };

        const testDisc2 = {
            title: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            format: ['test'],
            languages: []
        };

        const error = await validateDisc(testDisc);
        const error2 = await validateDisc(testDisc2);
        expect(error.path).toEqual('languages');
        expect(error2.path).toEqual('languages');
        expect(error.message).toEqual(discLanguageIsRequired);
        expect(error2.message).toEqual(discLanguageIsRequired);
    });
});

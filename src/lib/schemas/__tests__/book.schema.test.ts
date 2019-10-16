import { bookSchema } from '../';
import {
    titleIsRequired,
    authorIsRequired,
    typeIsRequired,
    languageIsRequired,
    invalidType,
    volumeMustBePositive
} from '../../messages/book.errorMessages';

describe('Book Schema', () => {
    const validateBook = async (book: any) => {
        let error;
        try {
            await bookSchema.validate(book);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when all required fields are present', async () => {
        // Minimal required fields
        const testBook = {
            title: 'test',
            authors: ['test'],
            type: 'novel',
            language: 'test',
            physical: false,
            digital: false,
            publisher: 'test'
        };
        // All fields present
        const testBook2 = {
            title: 'test',
            authors: ['test'],
            colorers: ['test'],
            letterers: ['test'],
            type: 'novel',
            language: 'test',
            volume: 1,
            isbn: 't-es-ttes-t',
            physical: false,
            digital: false,
            publisher: 'test',
            series: 'test',
            location: 'test',
            listPrice: 'test usd',
            image: 'http://www.test.com',
            checkedOut: true,
            checkedOutBy: 'test'
        };

        const error = await validateBook(testBook);
        const error2 = await validateBook(testBook2);

        expect(error).toBeUndefined();
        expect(error2).toBeUndefined();
    });

    it('Returns an error when the title field is absent', async () => {
        const testBook = {
            authors: ['test'],
            type: 'novel',
            language: 'test',
            physical: false,
            digital: false,
            publisher: 'test'
        };

        const error = await validateBook(testBook);
        expect(error.path).toEqual('title');
        expect(error.message).toEqual(titleIsRequired);
    });

    it('Returns an error when the authors field is absent', async () => {
        // Test missing property
        const testBook = {
            title: 'test',
            type: 'novel',
            language: 'test',
            physical: false,
            digital: false,
            publisher: 'test'
        };

        const error = await validateBook(testBook);
        expect(error.path).toEqual('authors');
        expect(error.message).toEqual(authorIsRequired);

        // Test property with only default value
        const testBook2 = {
            title: 'test',
            authors: [],
            type: 'novel',
            language: 'test',
            physical: false,
            digital: false,
            publisher: 'test'
        };

        const error2 = await validateBook(testBook2);
        expect(error2.path).toEqual('authors');
        expect(error2.message).toEqual(authorIsRequired);
    });

    it('Returns an error when the type field is absent', async () => {
        const testBook = {
            title: 'test',
            authors: ['test'],
            language: 'test',
            physical: false,
            digital: false,
            publisher: 'test'
        };

        const error = await validateBook(testBook);
        expect(error.path).toEqual('type');
        expect(error.message).toEqual(typeIsRequired);
    });

    it('Returns an error when the language field is absent', async () => {
        const testBook = {
            title: 'test',
            authors: ['test'],
            type: 'novel',
            physical: false,
            digital: false,
            publisher: 'test'
        };

        const error = await validateBook(testBook);
        expect(error.path).toEqual('language');
        expect(error.message).toEqual(languageIsRequired);
    });

    it('Returns an error when a valid type option is not chosen', async () => {
        const testBook = {
            title: 'test',
            authors: ['test'],
            type: 'invalidType',
            language: 'test',
            physical: false,
            digital: false,
            publisher: 'test'
        };

        const error = await validateBook(testBook);
        expect(error.path).toEqual('type');
        expect(error.message).toEqual(invalidType);
    });

    it('Returns an error when volume is not positive', async () => {
        const testBook = {
            title: 'test',
            authors: ['test'],
            type: 'novel',
            language: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            volume: -1
        };

        const testBook2 = {
            title: 'test',
            authors: ['test'],
            type: 'novel',
            language: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            volume: 0
        };

        const error = await validateBook(testBook);
        const error2 = await validateBook(testBook2);
        expect(error.path).toEqual('volume');
        expect(error2.path).toEqual('volume');
        expect(error.message).toEqual(volumeMustBePositive);
        expect(error2.message).toEqual(volumeMustBePositive);
    });
});

import { bookSchema } from '../';

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
            image: 'test.com',
            checkedOut: true,
            checkedOutBy: 'test'
        };

        const error = await validateBook(testBook);
        const error2 = await validateBook(testBook2);

        expect(error).toBeUndefined();
        expect(error2).toBeUndefined();
    });
});

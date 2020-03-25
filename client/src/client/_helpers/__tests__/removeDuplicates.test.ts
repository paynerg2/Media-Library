import { removeDuplicates } from '../removeDuplicates';

describe('Remove Duplicates helper', () => {
    describe('When given an array with duplicate entries', () => {
        it('Returns a new array of the unique entries', () => {
            const testArray: Array<string> = [
                'test',
                'test2',
                'test',
                'test3',
                'test'
            ];
            const expectedOutput: Array<string> = ['test', 'test2', 'test3'];
            expect(removeDuplicates(testArray)).toEqual(expectedOutput);
        });
    });

    describe('When given an array without duplicate entires', () => {
        it('Returns a new array with the same entires', () => {
            const testArray: Array<string> = ['test', 'test2', 'test3'];
            expect(removeDuplicates(testArray)).toEqual(testArray);
        });

        it('Preserves order', () => {
            const testArray: Array<string> = ['test', 'test2', 'test3'];
            for (let i = 0; i < testArray.length; i++) {
                expect(removeDuplicates(testArray)[i]).toEqual(testArray[i]);
            }
        });
    });
});

import { filterByKeys } from '../filterByKeys';

describe('Filter By Keys Helper', () => {
    const testObj = {
        test: 'test',
        test2: 'test2',
        test3: 'test3',
        test4: 'test4'
    };

    it('Returns a new object with filtered keys', () => {
        const allowedKeys = ['test', 'test2'];
        const expectedResult = {
            test: 'test',
            test2: 'test2'
        };
        const actualResult = filterByKeys(testObj, allowedKeys);
        expect(actualResult).toEqual(expectedResult);
    });

    it('Gives an empty object if allowedKeys=[]', () => {
        const actualResult = filterByKeys(testObj, []);
        expect(actualResult).toEqual({});
    });

    it('Gives an empty object if no keys match', () => {
        const allowedKeys = ['fake', 'keys'];
        const actualResult = filterByKeys(testObj, allowedKeys);
        expect(actualResult).toEqual({});
    });

    it('Gives an empty object if input is an empty object', () => {
        const actualResult = filterByKeys({}, []);
        expect(actualResult).toEqual({});
    });

    it('Returns a copy of the input object if allowedKeys contains all keys', () => {
        const expectedResult = {
            test: 'test',
            test2: 'test2',
            test3: 'test3',
            test4: 'test4'
        };
        const allowedKeys = Object.keys(testObj);
        const actualResult = filterByKeys(testObj, allowedKeys);
        expect(actualResult).toEqual(expectedResult);
        // Should not refer to the same object
        expect(actualResult === expectedResult).toEqual(false);
    });
});

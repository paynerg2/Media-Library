import { normalize } from '../normalize';

describe('Normalize Helper Method', () => {
    const testData = [
        { _id: 1, property1: 'test', property2: 'test2' },
        { _id: 2, property1: 'test3', property2: 'test4' },
        { _id: 3, property1: 'test4', property2: 'test5' }
    ];
    const expectedNormalizedTestData = {
        1: {
            property1: 'test',
            property2: 'test2'
        },
        2: {
            property1: 'test3',
            property2: 'test4'
        },
        3: {
            property1: 'test4',
            property2: 'test5'
        }
    };
    it('Normalizes data', () => {
        expect(normalize(testData)).toEqual(expectedNormalizedTestData);
    });
});

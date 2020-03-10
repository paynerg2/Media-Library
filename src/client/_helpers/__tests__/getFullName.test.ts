import { getFullName } from '../getFullName';
import { Creator } from '../../../lib/interfaces';

describe('Get Full Name Helper', () => {
    const baseTestCreator: Creator = {
        firstName: 'test',
        works: ['test']
    };

    it('Handles [FirstName M. LastName] format correctly', () => {
        const testCreator: Creator = {
            ...baseTestCreator,
            middleInitials: 'T.',
            lastName: 'tester'
        };
        const expectedResult = `${testCreator.firstName} ${testCreator.middleInitials} ${testCreator.lastName}`;
        expect(getFullName(testCreator)).toEqual(expectedResult);
    });

    it('Handles [FirstName LastName] format correctly', () => {
        const testCreator: Creator = {
            ...baseTestCreator,
            lastName: 'tester'
        };
        const expectedResult = `${testCreator.firstName} ${testCreator.lastName}`;
        expect(getFullName(testCreator)).toEqual(expectedResult);
    });

    it('Handles [FirstName] format correctly', () => {
        const testCreator: Creator = {
            ...baseTestCreator
        };
        const expectedResult = testCreator.firstName;
        expect(getFullName(testCreator)).toEqual(expectedResult);
    });
});

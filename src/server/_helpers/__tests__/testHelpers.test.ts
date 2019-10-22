import { getCleanedResponse } from '../testHelpers';

describe('Test Helpers', () => {
    describe('GetCleanedResponse', () => {
        it('Removes the properties _id and __v from single object', () => {
            const input = {
                _id: 'test',
                __v: 0,
                property: 'test',
                property2: 'test'
            };
            const expectedOutput = {
                property: 'test',
                property2: 'test'
            };
            const actualOutput = getCleanedResponse(input);
            expect(actualOutput).toEqual(expectedOutput);
        });

        it('Removes the properties _id and __v from all objects in an array', () => {
            const input = [
                {
                    _id: 'test',
                    __v: 0,
                    property: 'test',
                    property2: 'test'
                },
                {
                    _id: 'test2',
                    __v: 0,
                    property: 'test2',
                    property2: 'test2'
                },
                {
                    _id: 'test3',
                    __v: 0,
                    property: 'test3',
                    property2: 'test3'
                }
            ];
            const expectedOutput = [
                {
                    property: 'test',
                    property2: 'test'
                },
                {
                    property: 'test2',
                    property2: 'test2'
                },
                {
                    property: 'test3',
                    property2: 'test3'
                }
            ];
            const actualOutput = getCleanedResponse(input);
            expect(actualOutput).toEqual(expectedOutput);
        });
    });
});

import { getSeriesIdMap } from '../getSeriesIdMap';

describe('Get Series By Id Map Helper', () => {
    it('Returns an empty object if no data', () => {
        expect(getSeriesIdMap([])).toEqual({});
    });

    it('Returns a map of data in the expected format when no series overlap', () => {
        const testItem1 = {
            series: 'test',
            _id: 'testid'
        };
        const testItem2 = {
            series: 'test2',
            _id: 'testid2'
        };
        const testData = [testItem2, testItem1];
        const expectedResult = {
            [testItem1.series]: [testItem1._id],
            [testItem2.series]: [testItem2._id]
        };
        const actualResult = getSeriesIdMap(testData);
        expect(actualResult).toEqual(expectedResult);
    });

    it('Returns a map of data in the expected format when overlap in series', () => {
        const testItem1 = {
            series: 'test',
            _id: 'testid'
        };
        const testItem2 = {
            series: testItem1.series,
            _id: 'testid2'
        };
        const testItem3 = {
            series: 'test2',
            _id: 'testId3'
        };
        const testData = [testItem1, testItem2, testItem3];
        const expectedResult = {
            [testItem1.series]: [testItem1._id, testItem2._id],
            [testItem3.series]: [testItem3._id]
        };
        const actualResult = getSeriesIdMap(testData);
        expect(actualResult).toEqual(expectedResult);
    });
});

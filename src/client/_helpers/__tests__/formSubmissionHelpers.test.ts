import {
    assureCreatorExists,
    assureCompanyExists,
    assureSeriesExists
} from '../formSubmissionHelpers';
import { Creator, Series, Company } from '../../../lib/interfaces';
import { StringTMap } from '../../_interfaces/stringTMap.interface';
import { creatorActions, seriesActions, companyActions } from '../../_actions';

describe('Form Submission Helpers', () => {
    const dispatchMock = jest.fn();

    afterAll(() => {
        dispatchMock.mockClear();
    });

    describe('assureCreatorExists', () => {
        // Initialize test data
        const testCreator1: Creator = {
            firstName: 'test',
            middleInitials: 'T.',
            lastName: 'lastname',
            works: ['test 1', 'test 2']
        };
        const testCreator2: Creator = {
            ...testCreator1,
            middleInitials: 'D.',
            lastName: 'otherlastname'
        };

        const testNormalizedCreatorCollection: StringTMap<Creator> = {
            testid1: testCreator1,
            testid2: testCreator2
        };

        // Test creator names of each expected variety
        const newCreator = 'New C. Reator';
        const newCreator2 = 'Newer Creator';
        const newCreator3 = 'newcreator';

        // Mock dependencies
        creatorActions.create = jest.fn();

        it('Calls dispatch with the expected values if creator does not exist', () => {
            const expectedCreator: Creator = {
                firstName: 'New',
                middleInitials: 'C.',
                lastName: 'Reator',
                works: testCreator1.works[0]
            };

            assureCreatorExists(
                testNormalizedCreatorCollection,
                dispatchMock,
                newCreator,
                testCreator1.works[0]
            );
            expect(dispatchMock).toHaveBeenCalledWith(
                creatorActions.create(expectedCreator)
            );
        });

        it('Dispatches expected value when name is [firstName lastName] format.', () => {
            const expectedCreator: Creator = {
                firstName: 'Newer',
                lastName: 'Creator',
                works: testCreator1.works[0]
            };

            assureCreatorExists(
                testNormalizedCreatorCollection,
                dispatchMock,
                newCreator2,
                testCreator1.works[0]
            );
            expect(dispatchMock).toHaveBeenCalledWith(
                creatorActions.create(expectedCreator)
            );
        });

        it('Dispatches expected value when name is only one word', () => {
            const expectedCreator: Creator = {
                firstName: newCreator3,
                works: testCreator1.works[0]
            };

            assureCreatorExists(
                testNormalizedCreatorCollection,
                dispatchMock,
                newCreator3,
                testCreator1.works[0]
            );
            expect(dispatchMock).toHaveBeenCalledWith(
                creatorActions.create(expectedCreator)
            );
        });

        it('Does not call dispatch if the creator already exists', () => {
            creatorActions.create = jest.fn();
            dispatchMock.mockClear();

            assureCreatorExists(
                testNormalizedCreatorCollection,
                dispatchMock,
                `${testCreator1.firstName} ${testCreator1.middleInitials} ${testCreator1.lastName}`,
                testCreator1.works[0]
            );
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('assureSeriesExists', () => {
        // Initialize test data
        const testSeries1: Series = {
            name: 'test',
            items: ['test1', 'test2']
        };
        const testSeries2: Series = {
            ...testSeries1,
            name: 'test2'
        };

        const testNormalizedSeriesCollection = {
            test1: testSeries1,
            test2: testSeries2
        };

        // Mock dependencies
        seriesActions.create = jest.fn();

        it('Calls dispatch with expected value when series does not exist', () => {
            const testName = 'testName';
            const testItem = 'testItem';

            const expectedSeries: Series = {
                name: testName,
                items: [testItem]
            };

            assureSeriesExists(
                testNormalizedSeriesCollection,
                dispatchMock,
                testName,
                testItem
            );
            expect(dispatchMock).toHaveBeenCalledWith(
                seriesActions.create(expectedSeries)
            );
        });

        it('Does not call dispatch when series exists', () => {
            dispatchMock.mockClear();
            assureSeriesExists(
                testNormalizedSeriesCollection,
                dispatchMock,
                testSeries1.name,
                testSeries1.items[0]
            );
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('assureCompanyExists', () => {
        // Initialize test data
        const testCompany1: Company = {
            name: 'test',
            titles: ['test1', 'test2']
        };
        const testCompany2: Company = {
            ...testCompany1,
            name: 'test2'
        };

        const testNormalizedCompanyCollection = {
            test1: testCompany1,
            test2: testCompany2
        };

        // Mock dependencies
        companyActions.create = jest.fn();

        it('Calls dispatch with expected value when company does not exist', () => {
            const testName = 'testCompany';
            const testTitle = 'testTitle';
            const expectedCompany: Company = {
                name: testName,
                titles: [testTitle]
            };

            assureCompanyExists(
                testNormalizedCompanyCollection,
                dispatchMock,
                testName,
                testTitle
            );
            expect(dispatchMock).toHaveBeenCalledWith(
                companyActions.create(expectedCompany)
            );
        });

        it('Does not call dispatch when company already exists', () => {
            dispatchMock.mockClear();
            assureCompanyExists(
                testNormalizedCompanyCollection,
                dispatchMock,
                testCompany1.name,
                testCompany1.titles[0]
            );
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });
});

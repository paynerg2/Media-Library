import Company from '../company.model';
import { Company as CompanyParams } from '../../../lib/interfaces';
import { companyService } from '../company.service';
import { mockDocumentQuery } from '../../_helpers/testHelpers';
import { logger } from '../../_helpers/logger';
import { duplicateCompany } from '../../../lib/messages/company.errorMessages';

describe('Company Service', () => {
    beforeAll(() => {
        logger.error = jest.fn();
    });

    describe('Create Method Guard Clauses', () => {
        it('Logs and throws error if company already exists', async () => {
            Company.findOne = jest.fn(() => {
                return mockDocumentQuery;
            });
            const testCompany: CompanyParams = {
                name: 'test',
                titles: []
            };
            try {
                await companyService.create(testCompany);
            } catch (error) {
                expect(logger.error).toHaveBeenCalledWith(duplicateCompany);
                expect(error.message).toEqual(duplicateCompany);
            }
        });
    });
});

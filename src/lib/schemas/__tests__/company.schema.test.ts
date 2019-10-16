import { companySchema } from '../company.schema';
import { companyNameIsRequired } from '../../messages/company.errorMessages';

describe('Login Schema', () => {
    const validateCompany = async (company: any) => {
        let error;
        try {
            await companySchema.validate(company);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when all required fields are present', async () => {
        const testCompany = {
            name: 'test'
        };
        const error = await validateCompany(testCompany);
        expect(error).toBeUndefined();
    });

    it('Returns an error if company name not present', async () => {
        const testCompany = {
            works: ['test', 'test']
        };
        const error = await validateCompany(testCompany);
        expect(error.path).toEqual('name');
        expect(error.message).toEqual(companyNameIsRequired);
    });
});

import { companySchema } from '../company.schema';
import {
    companyNameIsRequired,
    timeTravellingNotAllowed,
    invalidUrl,
    invalidStatus
} from '../../messages/company.errorMessages';

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
    const testCompany = {
        name: 'test'
    };

    it('Does not reject when all required fields are present', async () => {
        const error = await validateCompany(testCompany);
        expect(error).toBeUndefined();
    });

    it('Does not reject when all fields are appropriately filled out', async () => {
        const goodTestCompany = {
            ...testCompany,
            title: ['test', 'test', 'test'],
            founded: new Date('01-01-1969'),
            founder: 'test',
            headquarters: 'test',
            owners: ['test', 'test2'],
            predecessor: 'test',
            parent: 'test',
            website: 'www.test.com',
            status: 'Active'
        };
        try {
            await validateCompany(goodTestCompany);
        } catch (error) {
            expect(error).toBeUndefined();
        }
    });

    it('Returns an error if company name not present', async () => {
        const testCompany = {
            works: ['test', 'test']
        };
        const error = await validateCompany(testCompany);
        expect(error.path).toEqual('name');
        expect(error.message).toEqual(companyNameIsRequired);
    });

    it('Returns an error if date founded is from the future', async () => {
        const today = new Date();
        const tomorrow = today.setDate(today.getDate() + 1);
        const testCompanyWithFutureDate = {
            ...testCompany,
            founded: new Date(tomorrow)
        };
        const error = await validateCompany(testCompanyWithFutureDate);
        expect(error.path).toEqual('founded');
        expect(error.message).toEqual(timeTravellingNotAllowed);
    });

    it('Returns an error if website url is invalid', async () => {
        const badUrl = '!';
        const testCompanyWithBadWebsite = {
            ...testCompany,
            website: badUrl
        };
        const error = await validateCompany(testCompanyWithBadWebsite);
        expect(error.path).toEqual('website');
        expect(error.message).toEqual(invalidUrl);
    });

    it('Returns an error if status is not a viable option', async () => {
        const badStatus = 'test';
        const testCompanyWithBadStatus = {
            ...testCompany,
            status: badStatus
        };
        const error = await validateCompany(testCompanyWithBadStatus);
        expect(error.path).toEqual('status');
        expect(error.message).toEqual(invalidStatus);
    });
});

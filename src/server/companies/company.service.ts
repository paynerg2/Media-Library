import Company from './company.model';
import { ICompany } from './company.interface';
import { Company as CompanyParams } from '../../lib/interfaces';
import {
    duplicateCompany,
    companyNotFound
} from '../../lib/messages/company.errorMessages';
import { IService } from '../_interfaces/service.interface';
import { getSimpleService } from '../_helpers/getSimpleService';
import { duplicateSeries } from '../../lib/messages/series.errorMessages';

const errorMessages = {
    create: duplicateCompany,
    getById: companyNotFound,
    update: companyNotFound
};

const service: IService<CompanyParams, ICompany> = getSimpleService<
    CompanyParams,
    ICompany
>(Company, errorMessages);

const create = async (companyParams: CompanyParams): Promise<ICompany> => {
    const companyAlreadyExists = await Company.findOne({
        name: companyParams.name
    });
    if (companyAlreadyExists) {
        throw Error(duplicateSeries);
    }

    return await service.create(companyParams);
};

export const companyService: IService<CompanyParams, ICompany> = {
    getAll: service.getAll,
    getById: service.getById,
    create,
    update: service.update,
    delete: service.delete
};

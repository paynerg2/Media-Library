import { logger } from './logger';
import { IService } from '../_interfaces/service.interface';
import { Document, Model } from 'mongoose';

const handleError = (error: Error, errorMessage?: string) => {
    if (errorMessage) {
        logger.error(`${error.message} : ${errorMessage}`);
    } else {
        logger.error(error.message);
    }
};

const create = <T extends any, R extends Document>(
    model: Model<R>,
    errorMessage?: string
) => async (params: T): Promise<R> => {
    try {
        const newItem = new model(params);
        return await newItem.save();
    } catch (error) {
        handleError(error, errorMessage);
        throw Error(errorMessage ? errorMessage : error.message);
    }
};

const update = <T extends any, R extends Document>(
    model: Model<R>,
    errorMessage?: string
) => async (id: string, params: T): Promise<R> => {
    let item;
    try {
        item = await model.findById(id);
        if (item) {
            Object.assign(item, params);
            return await item.save();
        }
        throw Error(errorMessage);
    } catch (error) {
        handleError(error, errorMessage);
        throw Error(errorMessage ? errorMessage : error.message);
    }
};

const getAll = <T extends any, R extends Document>(
    model: Model<R>
) => async (): Promise<R[]> => {
    return await model.find({});
};

const getById = <T extends any, R extends Document>(
    model: Model<R>,
    errorMessage?: string
) => async (id: string): Promise<R | null> => {
    try {
        return await model.findById(id);
    } catch (error) {
        handleError(error, errorMessage);
        throw Error(errorMessage ? errorMessage : error.message);
    }
};

const _delete = <T extends any, R extends Document>(model: Model<R>) => async (
    id: string
) => {
    await model.findByIdAndRemove(id);
};

export const getSimpleService = <T extends any, R extends Document>(
    model: any,
    errorMessages?: any
): IService<T, R> => {
    return {
        create: create<T, R>(model, errorMessages.create),
        update: update<T, R>(model, errorMessages.update),
        getAll: getAll<T, R>(model),
        getById: getById<T, R>(model, errorMessages.getById),
        delete: _delete<T, R>(model)
    };
};

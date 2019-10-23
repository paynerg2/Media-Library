import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { getService } from '../_helpers/getService';
import { getSchema } from '../_helpers/getSchema';
import { logger } from './logger';
import { IService } from '../_interfaces/service.interface';

let schema: yup.ObjectSchema<object>;

const create = <T extends any, R extends any>(
    service: IService<T, R>
) => async (req: Request, res: Response, next: NextFunction) => {
    let validationError;
    try {
        await schema.validate(req.body.data);
    } catch (error) {
        validationError = error;
        logger.error(error.message);
        return next(error);
    }

    try {
        if (!validationError) {
            const item: R = await service.create(req.body.data);
            res.json(item);
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

const getAll = <T extends any, R extends any>(
    service: IService<T, R>
) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items: R[] = await service.getAll();
        res.json(items);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

const getById = <T extends any, R extends any>(
    service: IService<T, R>
) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item: R | null = await service.getById(req.params.id);
        item ? res.json(item) : res.sendStatus(404);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

const update = <T extends any, R extends any>(
    service: IService<T, R>
) => async (req: Request, res: Response, next: NextFunction) => {
    let validationError;
    try {
        await schema.validate(req.body.data);
    } catch (error) {
        validationError = error;
        logger.error(error.message);
        return next(error);
    }

    try {
        if (!validationError) {
            const updatedItem: R = await service.update(
                req.params.id,
                req.body.data
            );
            res.json(updatedItem);
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

const _delete = <T extends any, R extends any>(
    service: IService<T, R>
) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await service.delete(req.params.id);
        res.json({});
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

export const getRequestHandler = <T extends any, R extends any>(
    type: string
) => {
    schema = getSchema(type);
    const service: IService<any, any> = getService(type);
    return {
        create: create<T, R>(service),
        getAll: getAll<T, R>(service),
        getById: getById<T, R>(service),
        update: update<T, R>(service),
        delete: _delete<T, R>(service)
    };
};

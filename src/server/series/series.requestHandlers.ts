import { NextFunction, Request, Response } from 'express';
import { seriesService } from './series.service';
import { ISeries } from './series.interface';
import { seriesSchema } from '../../lib/schemas';
import { logger } from '../_helpers/logger';

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error;
    try {
        await seriesSchema.validate(req.body.data);
    } catch (err) {
        error = err;
        logger.error(err.message);
        return next(err);
    }

    try {
        if (!error) {
            const series = await seriesService.create(req.body.data);
            res.json(series);
        }
    } catch (err) {
        logger.error(err.message);
        next(err);
    }
};

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const series: ISeries[] = await seriesService.getAll();
        res.json(series);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const series: ISeries | null = await seriesService.getById(
            req.params.id
        );
        series ? res.json(series) : res.sendStatus(404);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error;
    try {
        await seriesSchema.validate(req.body.data);
    } catch (err) {
        error = err;
        logger.error(err.message);
        return next(err);
    }

    try {
        if (!error) {
            const updatedSeries = await seriesService.update(
                req.params.id,
                req.body.data
            );
            res.json(updatedSeries);
        }
    } catch (err) {
        logger.error(err.message);
        next(err);
    }
};

export const _delete = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await seriesService.delete(req.params.id);
        res.json({});
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

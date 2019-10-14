import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import { IUser } from './user.interface';
import { userSchema } from '../../lib/schemas';
import { invalidUsernameOrPassword } from '../../lib/messages/user.errorMessages';
import { logger } from '../_helpers/logger';

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    userService
        .authenticate(req.body.data)
        .then((user: IUser) =>
            user
                ? res.json(user)
                : res.status(400).json({ message: invalidUsernameOrPassword })
        )
        .catch((err: Error) => {
            logger.error(err);
            next(err);
        });
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error;
    try {
        await userSchema.validate(req.body.data);
    } catch (err) {
        error = err;
        logger.error(err);
        return next(err);
    }

    try {
        if (!error) {
            await userService.create(req.body.data);
            res.json({});
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    userService
        .getAll()
        .then((users: IUser[]) => res.json(users))
        .catch((err: Error) => {
            logger.error(err);
            next(err);
        });
};

export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    userService
        .getById(req.params.id)
        .then(user => (user ? res.json(user) : res.sendStatus(404)))
        .catch((err: Error) => {
            logger.error(err);
            next(err);
        });
};

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error;
    try {
        await userSchema.validate(req.body.data);
    } catch (err) {
        error = err;
        logger.error(err);
        return next(err);
    }

    try {
        if (!error) {
            await userService.update(req.params.id, req.body.data);
            res.json({});
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const _delete = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await userService.delete(req.params.id);
        res.json({});
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

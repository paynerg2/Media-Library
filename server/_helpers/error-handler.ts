import { Request, Response, NextFunction } from 'express';
import { invalidToken } from '../../client/src/lib/messages/error-handler.errorMessages';
import { logger } from './logger';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(`Request error: ${err}`);
    if (err.name === 'ValidationError') {
        // Mongoose or Yup validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // JWT Authentication Error
        return res.status(401).json({ message: invalidToken });
    }

    // Default to 500 server error
    return res.status(500).json({ message: err.message });
};

import { NextFunction } from 'express';
import { ValidationError } from 'yup';
import { UnauthorizedError, ErrorCode } from 'express-jwt';
import { errorHandler } from '../error-handler';
import { invalidToken } from '../../../client/src/lib/messages/error-handler.errorMessages';

describe('Error Handler (Helper)', () => {
    const req: any = {};
    const resStatus = jest.fn(() => res);
    const resJson = jest.fn(input => {
        return input;
    });
    const res: any = {
        status: resStatus,
        json: resJson
    };
    const next: NextFunction = jest.fn();

    it('Handles Validation Errors', () => {
        const testMessage = 'test';
        const expected = {
            message: testMessage
        };
        const err: Error = new ValidationError(testMessage, {}, '', {});
        const result = errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expected);
        expect(result).toEqual(expected);
    });

    it('Handles Unauthorized Errors', () => {
        const testInput = {
            message: invalidToken
        };
        const err: Error = new UnauthorizedError(
            'invalid_token' as ErrorCode,
            testInput
        );
        const result = errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(testInput);
        expect(result).toEqual(testInput);
    });

    it('Handles generic errors', () => {
        const testMessage = 'test';
        const expected = {
            message: testMessage
        };
        const err = new Error(testMessage);
        const result = errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expected);
        expect(result).toEqual(expected);
    });
});

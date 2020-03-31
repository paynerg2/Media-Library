import expressJwt, { IsRevokedCallback } from 'express-jwt';
import { userService } from '../users/user.service';
import { env } from '../_helpers/env';
import { logger } from './logger';

export const jwt = () => {
    let secret = process.env.PROD_SECRET || env.secret || 'temp_secret';
    logger.info(secret);
    logger.info(`config var: ${process.env.PROD_SECRET}`);
    logger.info(`env: ${env.secret}`);

    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes don't require auth
            'api/users/authenticate',
            'api/users/register'
        ]
    });
};

const isRevoked: IsRevokedCallback = async (req, payload, done) => {
    // Check if token is to be revoked
    const user = await userService.getById(payload.sub);
    if (!user) {
        logger.info(`JWT revoked | id: ${payload.sub}`);
        return done(null, true);
    }

    done(null);
};

import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import fs from 'fs';
import './_helpers/env';
import { errorHandler } from './_helpers/error-handler';
import { jwt } from './_helpers/jwt';

export const app: express.Application = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Set up logging
app.use(
    logger('common', {
        stream: fs.createWriteStream('./__logs__/access.log', { flags: 'a' })
    })
);
app.use(logger('dev'));

// Use JWT Auth
app.use(jwt());

// API Routes
app.use('/users', require('./users/user.controller'));
app.use('/series', require('./series/series.controller'));
app.use('/companies', require('./companies/company.controller'));
app.use('/creators', require('./creators/creator.controller'));
app.use('/books', require('./books/book.controller'));
app.use('/discs', require('./discs/disc.controller'));
app.use('/games', require('./games/game.controller'));

// Global Error Handler
app.use(errorHandler);

// Fix known deploy routing issue.
app.get('/*', function(req, res) {
    res.sendFile('../../public/index.html');
});

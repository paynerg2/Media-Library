import express from 'express';
import * as bodyParser from 'body-parser';
import path from 'path';
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

// Serve static assets
app.use(express.static(path.join(__dirname, '../client/build')));

// Use JWT Auth
app.use(jwt());

// API Routes
app.use('/api/users', require('./users/user.controller'));
app.use('/api/series', require('./series/series.controller'));
app.use('/api/companies', require('./companies/company.controller'));
app.use('/api/creators', require('./creators/creator.controller'));
app.use('/api/books', require('./books/book.controller'));
app.use('/api/discs', require('./discs/disc.controller'));
app.use('/api/games', require('./games/game.controller'));

// Global Error Handler
app.use(errorHandler);

// Fix known deploy routing issue.
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

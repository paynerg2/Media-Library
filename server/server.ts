import http from 'http';
import { connect } from './_helpers/connect';
import { app } from './app';
import { logger } from './_helpers/logger';

// Start Server
const PORT =
    process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000;

http.createServer(app).listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

// Connect to database
connect();

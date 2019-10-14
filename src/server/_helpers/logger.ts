import winston, { createLogger, format, transports } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import { Format } from 'logform';

const env: string = process.env.NODE_ENV || 'development';
const logDirName: string = '__logs__';

if (!fs.existsSync(logDirName)) {
    fs.mkdirSync(logDirName);
}

const filename: string = path.join(logDirName, '%DATE%-results.log');
const level: string = env === 'production' ? 'info' : 'debug';

const logFormats: Format[] = [
    format.label({
        label: path.basename(
            process.mainModule ? process.mainModule.filename : ''
        )
    }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.align(),
    format.printf(
        info =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
];

const consoleLogFormat: Format = format.combine(
    format.colorize(),
    ...logFormats
);

const fileLogFormat: Format = format.combine(...logFormats);

export const logger: winston.Logger = createLogger({
    level,
    silent: env === 'test' ? true : false,
    transports: [
        new transports.Console({
            format: consoleLogFormat
        }),
        new winstonDailyRotateFile({
            filename,
            datePattern: 'YYYY-MM-DD',
            format: fileLogFormat
        })
    ]
});

import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logDir = path.join( __dirname, '..', '..', 'logs' );

export const winstonLogger = winston.createLogger( {
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf( ( { timestamp, level, message } ) =>
        {
            return `[${ timestamp }] ${ level.toUpperCase() }: ${ message }`;
        } ),
    ),
    transports: [
        new winston.transports.DailyRotateFile( {
            filename: `${ logDir }/%DATE%/error.log`,
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        } ),
        new winston.transports.DailyRotateFile( {
            filename: `${ logDir }/%DATE%/combined.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        } ),
        new winston.transports.Console( {
            format: winston.format.combine(
                winston.format.colorize(),
                nestWinstonModuleUtilities.format.nestLike( 'MyApp', { prettyPrint: true } ),
            ),
        } ),
    ],
} );

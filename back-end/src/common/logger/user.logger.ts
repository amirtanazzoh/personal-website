import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import * as moment from 'moment-timezone';

const logDir = path.join( process.cwd(), 'logs' );

@Injectable()
export class UserLoggerService
{
    private logger: winston.Logger;

    constructor ()
    {
        this.logger = winston.createLogger( {
            transports: [
                new winston.transports.DailyRotateFile( {
                    filename: `${ logDir }/%DATE%/requests.log`,
                    level: 'info',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.printf( ( { timestamp, level, message } ) =>
                        {
                            const localTime = moment( timestamp as any )
                                .tz( 'Asia/Tehran' )
                                .format( 'YYYY-MM-DD HH:mm:ss' );
                            return `[${ localTime }] ${ level.toUpperCase() }: ${ JSON.stringify( message, null, 2 ) }`;
                        } ) ),
                } ),
            ],
        } );
    }

    log ( data: any ) { this.logger.info( data ); }
}

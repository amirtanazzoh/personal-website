import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { UserLoggerService } from '../logger/user.logger';

@Injectable()
export class LogInterceptor implements NestInterceptor
{
    constructor ( private readonly logger: UserLoggerService ) { }

    intercept ( context: ExecutionContext, next: CallHandler ): Observable<any>
    {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const { method, url, body, headers } = request;

        if ( method === 'GET' ) return next.handle();

        const startTime = Date.now();



        return next.handle().pipe(

            tap( ( data ) =>
            {
                const sanitizedRequestBody = this.sanitize( body );
                const sanitizedResponse = this.sanitize( data );
                const sanitizedRequestHeader = this.sanitize( headers );

                const duration = Date.now() - startTime;
                const logEntry = {
                    timestamp: new Date().toISOString(),
                    method,
                    url,
                    duration: `${ duration }ms`,
                    request: { headers: sanitizedRequestHeader, body: sanitizedRequestBody },
                    response: sanitizedResponse,
                };
                this.logger.log( logEntry );
            } ),
        );
    }

    private sanitize ( obj: any ): any
    {
        const SENSITIVE_KEYS = [ 'password', 'pass', 'pwd', 'access_token', 'refresh_token', 'token', 'secret', 'x-sec-app', 'authorization' ];

        if ( Array.isArray( obj ) )
        {
            return obj.map( ( item ) => this.sanitize( item ) );
        } else if ( obj && typeof obj === 'object' )
        {
            return Object.keys( obj ).reduce( ( acc, key ) =>
            {
                const lowerKey = key.toLowerCase();
                acc[ key ] = SENSITIVE_KEYS.includes( lowerKey )
                    ? '*****'
                    : this.sanitize( obj[ key ] );
                return acc;
            }, {} as any );
        }
        return obj;
    }
}

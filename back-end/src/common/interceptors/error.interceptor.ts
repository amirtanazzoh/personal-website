import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class ErrorLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const request = context.switchToHttp().getRequest();
        this.logger.error(
          `Error during ${request.method} ${request.url}: ${err.message}`,
          err.stack,
        );
        return throwError(() => err); // rethrow the error
      }),
    );
  }
}

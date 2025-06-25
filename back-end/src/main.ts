import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/logger/winston.logger';
import { WinstonModule } from 'nest-winston';
import { ApiKeyService } from './modules/auth/api-key.service';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { UserLoggerService } from './common/logger/user.logger';
import { LogInterceptor } from './common/interceptors/log.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap ()
{
  const app = await NestFactory.create( AppModule,
    { logger: WinstonModule.createLogger( { instance: winstonLogger } ) } );

  app.use( cookieParser() );

  app.enableCors(
    {
      origin: process.env.APP_DOMAIN,
      credentials: true
    } );

  app.useGlobalPipes( new ValidationPipe( { whitelist: true, forbidNonWhitelisted: true, transform: true, } ) );

  app.useGlobalGuards( new ApiKeyGuard( app.get( ApiKeyService ) ) );

  app.useGlobalInterceptors( new LogInterceptor( app.get( UserLoggerService ) ) );

  app.setGlobalPrefix( 'api/v1' );

  await app.listen( process.env.PORT ?? 3000 );
}
bootstrap();

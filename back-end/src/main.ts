import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/logger/winston.logger';
import { WinstonModule } from 'nest-winston';

async function bootstrap ()
{
  const app = await NestFactory.create( AppModule, {
    logger: WinstonModule.createLogger( {
      instance: winstonLogger,
    } ),
  } );

  app.useGlobalPipes(
    new ValidationPipe( {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    } ),
  );

  // const apiKeyService = app.get(ApiKeyService);
  // app.useGlobalGuards(new ApiKeyGuard(apiKeyService));

  await app.listen( process.env.PORT ?? 3000 );
}
bootstrap();

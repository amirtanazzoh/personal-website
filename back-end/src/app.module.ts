import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './modules/post/post.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/error.filter';
import { ErrorLoggerInterceptor } from './common/interceptors/error.interceptor';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_THROTTLER } from './utils/constants.util';
import { JwtStrategy } from './common/strategies/auth.strategy';
import { JWTConfigModule } from './modules/jwt.module';
import { FileModule } from './modules/file/file.module';
import { UserLoggerService } from './common/logger/user.logger';
import { ProjectModule } from './modules/project/project.module';
import { MailModule } from './modules/mail/mail.module';
import ChatModule from './modules/chat/chat.module';


@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: true } ),
    ThrottlerModule.forRoot( [ APP_THROTTLER ] ),
    JWTConfigModule,
    DatabaseModule,
    PostModule,
    UserModule,
    AuthModule,
    FileModule,
    ProjectModule,
    MailModule,
    ChatModule
  ],
  providers: [
    JwtStrategy,
    UserLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
} )
export class AppModule { }

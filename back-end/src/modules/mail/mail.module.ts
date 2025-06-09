import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MailService } from './mail.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule } from '@nestjs/config';

@Module( {
  imports: [
    ConfigModule.forRoot( {
      isGlobal: true, // Load .env globally
    } ),
    MailerModule.forRoot( {
      defaults: {
        from: '"No Reply" <amirtanazzoh@gmail.com>',
      },
      transport: {
        service: 'gmail',
        auth: {
          user: 'amirtanazzoh@gmail.com',
          pass: process.env.GMAIL_PASSWORD, // Use environment variable for security
        }
      },
      template: {
        dir: join( __dirname, '../../../../src/modules/mail/templates' ), // Adjusted path
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    } ),
  ],
  providers: [ MailService ],
  exports: [ MailService ],
} )
export class MailModule { }

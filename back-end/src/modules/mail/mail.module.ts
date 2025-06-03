import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MailService } from './mail.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module( {
  imports: [
    MailerModule.forRoot( {
      defaults: {
        from: 'no-replay@amirtanazzoh.com'
      },
      transport: {
        host: 'localhost',
        port: 1025,
        secure: false,
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
  exports: [ MailService ]
} )
export class MailModule { }

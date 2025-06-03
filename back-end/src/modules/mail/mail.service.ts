import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService
{
    constructor ( private mailerService: MailerService ) { }

    async sendEmail ( to: string, subject: string, template: string, context: any )
    {
        await this.mailerService.sendMail( {
            to,
            subject,
            template,
            context, // Data to be sent to template
        } );
    }
}

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export const MailTitles = {
    Welcome: 'Welcome to my website! | AmirTanazzoh ',
    ForgetPassword: 'Forget your password? | AmirTanazzoh'
};

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

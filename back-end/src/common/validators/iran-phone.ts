import
{
    applyDecorators,
} from '@nestjs/common';
import { IsMobilePhone } from 'class-validator';

export function IsValidIRPhone ()
{
    return applyDecorators(
        IsMobilePhone( 'fa-IR', {}, { message: ( param ) => `${ param.property } must be a valid IR phone number` } )
    );
}
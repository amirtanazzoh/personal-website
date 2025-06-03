import { z } from "zod";


export function GeneralStringSchema ( inputName: string = 'Input' )
{
    return z.
        string()
        .min( 3, `${ inputName } length must be 3 at least.` )
        .max( 64, `${ inputName } length must be 64 at most` );
}

export function PasswordSchema ( inputName: string = 'Password' )
{
    return z.string()
        .min( 8, `${ inputName } length must be 8 at least.` )
        .max( 20, `${ inputName } length must be 20 at most.` )
        .regex( /[a-z]/, `${ inputName } must contain at least one lowercase letter.` )
        .regex( /[A-Z]/, `${ inputName } must contain at least one uppercase letter.` )
        .regex( /[0-9]/, `${ inputName } must contain at least one number.` );
}

export function PersianPhoneNumberSchema ( inputName: string = 'Phone Number' )
{
    return z
        .string()
        .regex( /^9\d{9}$/, `${ inputName } is Invalid!` );
}

export function UserNameSchema ( inputName: string = 'Username' )
{
    return GeneralStringSchema( inputName )
        .regex( /^[a-zA-Z][a-zA-Z0-9._]*$/, `${ inputName } must start with a letter and can only contain letters, numbers, underscores, and dots.`, );
}

export function EmailSchema ( inputName: string = 'Email' )
{
    return z
        .string()
        .email( `${ inputName } must be a valid email` );
}
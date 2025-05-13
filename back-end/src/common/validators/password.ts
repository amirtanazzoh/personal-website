import
{
    applyDecorators,
} from '@nestjs/common';
import
{
    IsString,
    Matches,
    Length,
} from 'class-validator';

export function IsValidPassword ()
{
    return applyDecorators(
        IsString(),
        Matches( /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]+$/, {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
        } ),
        Length( 8, 20, { message: 'Password must be between 8 and 20 characters long' } )
    );
}
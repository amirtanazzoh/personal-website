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

export function IsValidUsername ()
{
    return applyDecorators(
        IsString(),
        Matches( /^[A-Za-z0-9._-]+$/, {
            message:
                'Username can only contain letters, numbers, and the symbols: . _ -',
        } ),
        Length( 3, 20, {
            message: 'Username must be between 3 and 20 characters long',
        } ),
    );
}
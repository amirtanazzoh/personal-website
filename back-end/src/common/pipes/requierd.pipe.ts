// file: pipes/input-required.pipe.ts

import
{
    PipeTransform,
    Injectable,
    BadRequestException,
    ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ParseRequired implements PipeTransform
{
    transform ( value: any, metadata: ArgumentMetadata ): string
    {
        const paramName = metadata.data || 'input';


        if ( typeof value !== 'string' || !value.trim() )
        {
            throw new BadRequestException( `${ paramName } parameter is required.` );
        }

        return value.trim();
    }
}
